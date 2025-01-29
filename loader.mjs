import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Register ts-node/esm as the loader
register('ts-node/esm', pathToFileURL('./'));