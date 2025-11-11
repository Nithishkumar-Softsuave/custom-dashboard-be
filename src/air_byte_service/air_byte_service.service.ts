import { Injectable } from '@nestjs/common';
import { DBCredentialsDto } from './air_byte_service.dto';
import axios from 'axios';

@Injectable()
export class AirByteServiceService {
  async connectSourceDb(body: DBCredentialsDto): Promise<any> {
    try {
      const { host, port, userName, passWord, dataBaseName, dataBaseType } =
        body;
      const payload = {
        name: 'postgres_source',
        sourceDefinitionId:
          dataBaseType === 'postgres'
            ? 'decd338e-5647-4c0b-adf4-da0e75f5a750'
            : '',
        workspaceId: '06368f41-9022-42ba-97e1-51994d229264',
        connectionConfiguration: {
          host: host,
          port: port,
          database: dataBaseName,
          username: userName,
          password: passWord,
          ssl: false,
        },
      };

      const response: { data: any } = await axios.post(
        `${process.env.AIRBYTE_API_URL}/sources/create`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.AIRBYTE_API_TOKEN}`,
          },
        },
      );

      console.log('Source created:', response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Error creating source:', errorMessage);
      throw error;
    }
  }
}
