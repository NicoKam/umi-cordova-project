import React, { useEffect, useRef } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import invariant from 'tiny-invariant';
import { useHistoryStack } from './renderTools';
import './StackRouter.less';
import { injectHistory } from './historyInject';
import PersistContext from './PersistContext';

interface StackRouterProps {
  routerContext: any;
}

const StackRouter: React.FC<StackRouterProps> = (props) => {
  const { routerContext: context } = props;
  const { history, staticContext, match } = context;
  const [historyStack, offsetIndex, { push, replace, pop, go }] = useHistoryStack(history);
  const goStepRef = useRef<number>(0);

  useEffect(() => {
    injectHistory(history, (goStep) => {
      goStepRef.current = goStep;
    });
    return history.listen((_: any, action: string) => {
      if (goStepRef.current) {
        go(goStepRef.current);
        goStepRef.current = 0;
      } else {
        switch (action) {
          case 'PUSH':
            push();
            break;
          case 'POP':
            pop();
            break;
          case 'REPLACE':
            replace();
            break;
          default:
            push();
        }
      }
    });
  }, [history]);

  const classNames = `stack-routes-anim-${history.action === 'PUSH' ? 'push' : 'pop'}`;
  return (
    <TransitionGroup childFactory={child => React.cloneElement(child, { classNames })}>
      {historyStack.map((h, _index) => {
        const curHistory = _index === historyStack.length - 1 ? history : h;
        const curLocation = h.location;
        const isShow = _index === historyStack.length - 1;
        const key = offsetIndex + _index;
        if (!isShow && !h.persist) return null;
        return (
          <CSSTransition key={key} timeout={200}>
            {/* double transition support persist mode */}
            <CSSTransition in={isShow} timeout={200} classNames={classNames}>
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: _index }}>
                <RouterContext.Provider
                  value={{
                    history: curHistory,
                    location: curLocation,
                    match,
                    staticContext,
                  }}
                >
                  <PersistContext.Provider value={{ history: h }}>{props.children}</PersistContext.Provider>
                </RouterContext.Provider>
              </div>
            </CSSTransition>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

const StackRouterWrapper = ({ children }: { children: any }) => (
  <RouterContext.Consumer>
    {(context) => {
      invariant(context, 'You should not use <StackRouter> outside a <Router>');
      return <StackRouter routerContext={context}>{children}</StackRouter>;
    }}
  </RouterContext.Consumer>
);
export default StackRouterWrapper;
