import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import QueueManager from '../managers/queue';
import errorMsg from '../utils/error-msg';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'shuffle';
  public aliases = [];
  public examples = [
    ['shuffle', 'shuffles the current queue']
  ];

  private readonly queueManager: QueueManager;

  constructor(@inject(TYPES.Managers.Queue) queueManager: QueueManager) {
    this.queueManager = queueManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    const queue = this.queueManager.get(msg.guild!.id).get();

    if (queue.length <= 2) {
      await msg.channel.send(errorMsg('not enough songs to shuffle'));
      return;
    }

    this.queueManager.get(msg.guild!.id).shuffle();

    // TODO: better response
    await msg.channel.send('shuffled');
  }
}