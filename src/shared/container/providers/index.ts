import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

// TODO: add condition for dev | prod envs
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
