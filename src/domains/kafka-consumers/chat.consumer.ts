import { Injectable, Logger } from '@nestjs/common';
import Kafka from 'node-rdkafka';
import { User } from '../../users/user.entity';
import { UserRepository } from '../../users/user.repository';
import { UserEventStoreRepository } from '../stores/user-event.store';
import { UpdatePasswordEventDto } from 'users/dto';
import * as IShare from '../../interfaces';
import * as Event from '../../events';
import { config } from '../../../config';

interface IReceiveEvent {
  id: string;
  type: Event.UserEvent;
}

@Injectable()
export class ChatKakfaConsumerService {
  private readonly logger: Logger = new Logger('ChatKakfaConsumerService');
  private readonly consumer = new Kafka.KafkaConsumer(
    {
      'bootstrap.servers': config.EVENT_STORE_SETTINGS.bootstrapServers,
      'group.id': config.EVENT_STORE_SETTINGS.chat.groupId,
      'enable.auto.commit': true,
    },
    {
      'auto.offset.reset': 'earliest',
    },
  );

  constructor(private readonly userEventStoreRepository: UserEventStoreRepository, private readonly userRepository: UserRepository) {
    this.init();
  }

  async register(kafkaMsg: Kafka.Message) {
    const kafkaEvt = kafkaMsg.value.toString();
    const jsonEvent: IReceiveEvent = JSON.parse(kafkaEvt);
    console.log('ChatKakfaConsumerService_jsonEvent: ', jsonEvent);
    if (jsonEvent.type === Event.UserEvent.CREATEUSER) {
      const event = await this.userEventStoreRepository.getUserEventById(jsonEvent.id);
      if (event.data) {
        const user = await this.userRepository.createUser(event.data as User);
        if (user) {
          await this.userEventStoreRepository.register({ topic: config.EVENT_STORE_SETTINGS.topics.chatEvent }, event.id);
        }
      }
      return;
    }
    if (jsonEvent.type === Event.UserEvent.UPDATEUSERPASSWORD) {
      const event = await this.userEventStoreRepository.getUserEventById(jsonEvent.id);
      if (event.data) {
        const user = await this.userRepository.updateUserPassword(event.data as UpdatePasswordEventDto);
        if (user) {
          await this.userEventStoreRepository.register({ topic: config.EVENT_STORE_SETTINGS.topics.chatEvent }, event.id);
        }
      }
    }
  }

  /**
   * @description Init func
   */
  init() {
    this.consumer
      .on('ready', () => {
        this.consumer.subscribe([config.EVENT_STORE_SETTINGS.topics.chatEvent]);
        setInterval(() => {
          this.consumer.consume(config.EVENT_STORE_SETTINGS.poolOptions.max);
        }, 1000);
      })
      .on('data', (data) => {
        this.logger.log(JSON.parse(data.value.toString()), 'Check');
        this.register(data);
        this.consumer.commit();
      })
      .on('event.error', (err) => {
        this.logger.error(err.message, '', 'Event_Error');
      })
      .on('rebalance.error', (err) => {
        this.logger.error(err.message, '', 'Reblanace_Error');
      });

    this.consumer.connect({}, (err, data) => {
      if (err) {
        this.logger.error(err.message, '', 'ConsumerConnectError');
      }
    });
  }
}
