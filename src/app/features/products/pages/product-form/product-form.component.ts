import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Product } from '../../../../core/domain/models/product.model';
import { AppError } from '../../../../core/domain/models/app-error';
import { GetProductsUseCase } from '../../../../core/domain/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../../../core/domain/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../../../core/domain/use-cases/update-product.use-case';
import { VerifyProductIdUseCase } from '../../../../core/domain/use-cases/verify-product-id.use-case';
import { PRODUCT_RULES } from '../../../../shared/validators/product-rules';
import {
  releaseDateNotPastValidator,
  revisionOneYearAfterReleaseValidator,
} from '../../../../shared/validators/date-validators';
import { uniqueProductIdValidator } from '../../../../shared/validators/unique-id.validator';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';

/**
 * Formulario de registro y edicion de productos financieros.
 *
 *  F4 (crear): todos los campos editables; el id se valida como unico contra
 *      el servicio de verificacion.
 *  F5 (editar): el id permanece deshabilitado y se conservan las mismas
 *      validaciones del resto de campos.
 *
 * Maquetacion del formulario segun D2 y ubicacion del boton principal segun D3.
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, AppHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getProducts = inject(GetProductsUseCase);
  private readonly createProduct = inject(CreateProductUseCase);
  private readonly updateProduct = inject(UpdateProductUseCase);
  private readonly verifyId = inject(VerifyProductIdUseCase);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly rules = PRODUCT_RULES;

  form!: FormGroup;
  isEditMode = false;
  editingId: string | null = null;

  submitting = false;
  loadingProduct = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.buildForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.editingId = id;
      this.prepareEditMode(id);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group(
      {
        id: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(this.rules.id.minLength),
              Validators.maxLength(this.rules.id.maxLength),
            ],
            asyncValidators: [uniqueProductIdValidator(this.verifyId)],
            updateOn: 'blur',
          },
        ],
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(this.rules.name.minLength),
            Validators.maxLength(this.rules.name.maxLength),
          ],
        ],
        description: [
          '',
          [
            Validators.required,
            Validators.minLength(this.rules.description.minLength),
            Validators.maxLength(this.rules.description.maxLength),
          ],
        ],
        logo: ['', [Validators.required]],
        dateRelease: ['', [Validators.required, releaseDateNotPastValidator()]],
        dateRevision: [{ value: '', disabled: true }, [Validators.required]],
      },
      {
        validators: [
          revisionOneYearAfterReleaseValidator('dateRelease', 'dateRevision'),
        ],
      }
    );

    // La fecha de revision se calcula automaticamente (un anio despues) al
    // cambiar la fecha de liberacion, y permanece deshabilitada para el
    // usuario porque su valor es derivado.
    this.form.get('dateRelease')?.valueChanges.subscribe((value: string) => {
      this.syncRevisionDate(value);
    });
  }

  /** Calcula la fecha de revision como exactamente un anio despues. */
  private syncRevisionDate(releaseValue: string): void {
    const revision = this.form.get('dateRevision');
    if (!revision) {
      return;
    }
    if (!releaseValue) {
      revision.setValue('', { emitEvent: false });
      return;
    }
    const [year, month, day] = releaseValue.split('-').map((part) => Number(part));
    if ([year, month, day].some((part) => Number.isNaN(part))) {
      return;
    }
    const next = `${year + 1}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`;
    revision.setValue(next, { emitEvent: false });
  }

  private prepareEditMode(id: string): void {
    // En edicion el id no se modifica: se deshabilita y se retira la
    // validacion de unicidad para no marcar como tomado el propio registro.
    const idControl = this.form.get('id');
    idControl?.clearAsyncValidators();
    idControl?.disable();

    // La regla "fecha de liberacion >= hoy" aplica al registrar un producto
    // nuevo. Un producto existente pudo liberarse en el pasado, por lo que en
    // edicion se retira esa restriccion para no impedir actualizar el resto de
    // los campos. La coherencia revision = liberacion + 1 anio se mantiene.
    const releaseControl = this.form.get('dateRelease');
    releaseControl?.setValidators([Validators.required]);
    releaseControl?.updateValueAndValidity({ emitEvent: false });

    this.loadingProduct = true;
    this.getProducts
      .execute()
      .pipe(finalize(() => {
        this.loadingProduct = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (products) => {
          const product = products.find((item) => item.id === id);
          if (product) {
            this.patchForm(product);
          } else {
            this.errorMessage = 'No se encontro el producto que intentas editar.';
          }
          this.cdr.markForCheck();
        },
        error: (error: AppError) => {
          this.errorMessage = error.message;
          this.cdr.markForCheck();
        },
      });
  }

  private patchForm(product: Product): void {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      dateRelease: product.dateRelease,
    });
    this.form.get('dateRevision')?.setValue(product.dateRevision, { emitEvent: false });
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const value = this.form.getRawValue();

    const request$ = this.isEditMode
      ? this.updateProduct.execute(this.editingId as string, {
          name: value.name,
          description: value.description,
          logo: value.logo,
          dateRelease: value.dateRelease,
          dateRevision: value.dateRevision,
        })
      : this.createProduct.execute({
          id: value.id,
          name: value.name,
          description: value.description,
          logo: value.logo,
          dateRelease: value.dateRelease,
          dateRevision: value.dateRevision,
        });

    request$.pipe(finalize(() => {
      this.submitting = false;
      this.cdr.markForCheck();
    })).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (error: AppError) => {
        this.errorMessage = error.message;
        this.cdr.markForCheck();
      },
    });
  }

  /** Boton Reiniciar: limpia el formulario respetando el modo actual. */
  onReset(): void {
    this.errorMessage = null;
    if (this.isEditMode) {
      // En edicion, reiniciar vuelve a cargar los datos originales.
      this.form.reset();
      if (this.editingId) {
        this.prepareEditMode(this.editingId);
      }
      return;
    }
    this.form.reset({
      id: '',
      name: '',
      description: '',
      logo: '',
      dateRelease: '',
      dateRevision: '',
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  /** Indica si un control debe mostrar su estado de error. */
  shouldShowError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /** Devuelve el primer mensaje de error aplicable a un control. */
  errorFor(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.errors) {
      return null;
    }
    return this.resolveMessage(controlName, control);
  }

  private resolveMessage(controlName: string, control: AbstractControl): string {
    const errors = control.errors ?? {};

    if (errors['required']) {
      return 'Este campo es requerido.';
    }
    if (errors['minlength']) {
      const min = errors['minlength'].requiredLength;
      return `Debe tener al menos ${min} caracteres.`;
    }
    if (errors['maxlength']) {
      const max = errors['maxlength'].requiredLength;
      return `No debe superar los ${max} caracteres.`;
    }
    if (errors['idTaken']) {
      return 'El identificador ya existe. Ingresa uno diferente.';
    }
    if (errors['releaseDatePast']) {
      return 'La fecha debe ser igual o mayor a la fecha actual.';
    }
    if (errors['revisionNotOneYear']) {
      return 'La fecha debe ser exactamente un anio posterior a la liberacion.';
    }
    if (errors['pending']) {
      return 'Validando...';
    }
    return 'El valor ingresado no es valido.';
  }

  get idPending(): boolean {
    return !!this.form.get('id')?.pending;
  }

  get title(): string {
    return this.isEditMode ? 'Formulario de Edicion' : 'Formulario de Registro';
  }
}
