import { Sequelize } from 'sequelize';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '../common/user.model';
import { ISequelizeService, SequelizeServiceModels } from './squelize.service.interface';

@injectable()
export class SequelizeService implements ISequelizeService {
  client: Sequelize;
  models: SequelizeServiceModels;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    this.models = {} as SequelizeServiceModels;
  }

  async connect() {
    try {
      this.client = new Sequelize({
        dialect: 'mssql',
        define: {
          timestamps: false
        },
        host: this.configService.get('MSSQL_HOST'),
        database: this.configService.get('MSSQL_DATABASE'),
        username: this.configService.get('MSSQL_USERNAME'),
        schema: this.configService.get('MSSQL_SCHEMA'),
        password: this.configService.get('MSSQL_PASSWORD')
      });
      await this.client.authenticate();
      this.initModels();
      this.logger.log('[SequelizeService] Connected to database');
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error('[SequelizeService] Error connecting to database' + err.message);
      }
    }
  }

  async disconnect() {
    await this.client.close();
  }

  private initModels() {
    this.models['UserModel'] = UserModel.initModel(this.client);
  }
}
