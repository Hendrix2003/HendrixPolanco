import { of } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';
import { NewProduct, Product, ProductUpdate } from '../models/product.model';
import { GetProductsUseCase } from './get-products.use-case';
import { CreateProductUseCase } from './create-product.use-case';
import { UpdateProductUseCase } from './update-product.use-case';
import { DeleteProductUseCase } from './delete-product.use-case';
import { VerifyProductIdUseCase } from './verify-product-id.use-case';

function buildRepositoryMock(): jest.Mocked<ProductRepository> {
  return {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    verifyId: jest.fn(),
  } as unknown as jest.Mocked<ProductRepository>;
}

const sampleProduct: Product = {
  id: 'uno',
  name: 'Nombre producto',
  description: 'Descripcion producto',
  logo: 'assets-1.png',
  dateRelease: '2025-01-01',
  dateRevision: '2026-01-01',
};

describe('Casos de uso de producto', () => {
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = buildRepositoryMock();
  });

  it('GetProductsUseCase delega en el repositorio', (done) => {
    repository.getAll.mockReturnValue(of([sampleProduct]));
    const useCase = new GetProductsUseCase(repository);

    useCase.execute().subscribe((products) => {
      expect(products).toEqual([sampleProduct]);
      expect(repository.getAll).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('CreateProductUseCase reenvia el producto al repositorio', (done) => {
    const newProduct: NewProduct = { ...sampleProduct, id: 'dos' };
    repository.create.mockReturnValue(of(newProduct));
    const useCase = new CreateProductUseCase(repository);

    useCase.execute(newProduct).subscribe((product) => {
      expect(product.id).toBe('dos');
      expect(repository.create).toHaveBeenCalledWith(newProduct);
      done();
    });
  });

  it('UpdateProductUseCase envia id y cambios', (done) => {
    const changes: ProductUpdate = {
      name: 'Nombre actualizado',
      description: 'Descripcion producto',
      logo: 'assets-1.png',
      dateRelease: '2025-01-01',
      dateRevision: '2026-01-01',
    };
    repository.update.mockReturnValue(of({ ...sampleProduct, name: 'Nombre actualizado' }));
    const useCase = new UpdateProductUseCase(repository);

    useCase.execute('uno', changes).subscribe((product) => {
      expect(product.name).toBe('Nombre actualizado');
      expect(repository.update).toHaveBeenCalledWith('uno', changes);
      done();
    });
  });

  it('DeleteProductUseCase delega la eliminacion', (done) => {
    repository.delete.mockReturnValue(of(void 0));
    const useCase = new DeleteProductUseCase(repository);

    useCase.execute('uno').subscribe(() => {
      expect(repository.delete).toHaveBeenCalledWith('uno');
      done();
    });
  });

  it('VerifyProductIdUseCase devuelve el resultado de verificacion', (done) => {
    repository.verifyId.mockReturnValue(of(true));
    const useCase = new VerifyProductIdUseCase(repository);

    useCase.execute('uno').subscribe((exists) => {
      expect(exists).toBe(true);
      expect(repository.verifyId).toHaveBeenCalledWith('uno');
      done();
    });
  });
});
