import {
  EventObject,
  Interpreter,
  PayloadSender,
  State,
  Typestate,
  ResolvedTypeContainer
} from 'xstate';
import { useActor } from './useActor';

export function getServiceSnapshot<
  TService extends Interpreter<any, any, any, any>
>(service: TService): TService['state'] {
  // TODO: remove compat lines in a new major, replace literal number with InterpreterStatus then as well
  return ('status' in service ? service.status : (service as any)._status) !== 0
    ? service.state
    : service.machine.initialState;
}

/**
 * @deprecated Use `useActor` instead.
 *
 * @param service The interpreted machine
 * @returns A tuple of the current `state` of the service and the service's `send(event)` method
 */
export function useService<
  TContext,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext },
  TResolvedTypes extends ResolvedTypeContainer = ResolvedTypeContainer
>(
  service: Interpreter<TContext, any, TEvent, TTypestate, TResolvedTypes>
): [
  State<TContext, TEvent, any, TTypestate, TResolvedTypes>,
  PayloadSender<TEvent>
] {
  if (process.env.NODE_ENV !== 'production' && !('machine' in service)) {
    throw new Error(
      `Attempted to use an actor-like object instead of a service in the useService() hook. Please use the useActor() hook instead.`
    );
  }

  const [state] = useActor(service);

  return [state, service.send];
}
