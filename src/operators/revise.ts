import {Observable} from 'rxjs/Observable';
import {Operator} from 'rxjs/Operator';
import {Subscriber} from 'rxjs/Subscriber';
import {TeardownLogic} from 'rxjs/Subscription';

import {revise as sourceRevise, ReviseOptions} from '../revise';

export type RevisedLettable<T> = (source: Observable<T>) => Observable<T>;

/**
 * ReviseSubscriber tracks last revision value and only calls Subscriber if
 * value has changed after revise is called upon it.
 */
class ReviseSubscriber<T> extends Subscriber<T> {
  /** Last revision returned from revise. */
  private lastRevision: T;

  constructor(
      protected readonly destination: Subscriber<T>,
      private readonly reviseOptions?: ReviseOptions) {
    super(destination);
  }

  /** Override _next to only call when value has changed after revise call. */
  protected _next(revision: T): void {
    const newRevision =
        sourceRevise(this.lastRevision, revision, this.reviseOptions);
    if (this.lastRevision === newRevision) {
      return;
    }

    this.lastRevision = newRevision;
    this.destination.next(this.lastRevision);
  }
}

/**
 * ReviseOperator patches subscribers through ReviseSubscriber to avoid
 * triggering when object is unchanged after revise is called upon it.
 */
class ReviseOperator<T> implements Operator<T, T> {
  constructor(private readonly reviseOptions?: ReviseOptions) {}

  /** Implement operator call to inject ReviseSubscriber. */
  // tslint:disable-next-line no-any soruce is defined as any in rxjs/Operator.
  public call(subscriber: Subscriber<T>, source: Observable<T>): TeardownLogic {
    return source.subscribe(
        new ReviseSubscriber<T>(subscriber, this.reviseOptions));
  }
}

export const revise =
    <T>(reviseOptions?: ReviseOptions): RevisedLettable<T> => {
      return (source: Observable<T>) =>
                 source.lift(new ReviseOperator<T>(reviseOptions));
    };
