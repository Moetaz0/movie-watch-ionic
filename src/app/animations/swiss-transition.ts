import { AnimationBuilder, createAnimation } from '@ionic/core';

const DURATION = 380; // ms, make it 250 for snappier, 500 for slower
const DISTANCE = 6; // % of the screen width
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

export const swissTransition: AnimationBuilder = (_baseEl, opts: any) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const back = opts.direction === 'back';
  const sign = back ? -1 : 1;

  const root = createAnimation()
    .duration(reduceMotion ? 1 : DURATION)
    .easing(EASE)
    .fill('both');

  const entering = createAnimation()
    .addElement(opts.enteringEl)
    .beforeRemoveClass('ion-page-invisible')
    .fromTo('opacity', 0, 1)
    .fromTo('transform', `translateX(${sign * DISTANCE}%)`, 'translateX(0)');

  root.addAnimation(entering);

  if (opts.leavingEl) {
    const leaving = createAnimation()
      .addElement(opts.leavingEl)
      .fromTo('opacity', 1, 0)
      .fromTo('transform', 'translateX(0)', `translateX(${-sign * DISTANCE}%)`);
    root.addAnimation(leaving);
  }

  return root;
};