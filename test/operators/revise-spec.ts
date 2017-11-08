import {assert} from 'chai';
import {Observable, Observer} from 'rxjs';
import {SinonSpy, spy} from 'sinon';

import {revise} from '../../src/operators/revise';

describe.only('revise operator', () => {
  let next: Function;
  let subscriberSpy: SinonSpy;

  beforeEach(() => {
    subscriberSpy = spy();

    Observable
        .create((observer: Observer<{}>) => {
          next = (data: {}) => observer.next(data);
        })
        .pipe(revise())
        .subscribe(subscriberSpy);
  });

  it('should pass through new values', () => {
    next({foo: 'bar'});
    next({foo: 'baz'});
    assert.deepEqual(subscriberSpy.args, [
      [{foo: 'bar'}],
      [{foo: 'baz'}],
    ]);
  });

  it('should not pass through unchanged values', () => {
    next({foo: 'bar'});
    next({foo: 'bar'});
    next({foo: 'baz'});
    assert.deepEqual(subscriberSpy.args, [
      [{foo: 'bar'}],
      [{foo: 'baz'}],
    ]);
  });

  it('should revise paths', () => {
    const bar = [2, 3, 4];
    next({
      foo: [1, 2, 3],
      bar,
    });
    next({
      foo: [1, 2, 3, 4],
      bar,
    });

    // Each call only has one arg.
    const firstArgs = subscriberSpy.firstCall.args[0];
    const lastArgs = subscriberSpy.lastCall.args[0];

    assert.equal(lastArgs.bar, bar);
  });
});
