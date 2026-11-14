import type { Profile } from '../lib/schema';
export type Goal=Profile['goal'];
export const goals:Goal[]=['powerlifting','armwrestling','arms','bodybuilding','strength','fatloss','fitness','custom'];
export const templates:Record<Exclude<Goal,'powerlifting'>,{patterns:string[];reps:number;sets:number;progress:number;metrics:string[]}>={
 armwrestling:{patterns:['pronation','cup','rising','biceps','row','core'],reps:12,sets:3,progress:.01,metrics:['pronation','cup','rising','side']},
 arms:{patterns:['press','biceps','triceps','row','biceps','core'],reps:10,sets:3,progress:.025,metrics:['biceps','triceps','volume']},
 bodybuilding:{patterns:['squat','press','row','hinge','shoulder','core'],reps:10,sets:3,progress:.025,metrics:['volume','reps','rir']},
 strength:{patterns:['squat','press','hinge','row','core'],reps:5,sets:5,progress:.025,metrics:['squat','bench','deadlift']},
 fatloss:{patterns:['squat','press','pull','hinge','core','cardio'],reps:6,sets:3,progress:.01,metrics:['weight','strength','adherence']},
 fitness:{patterns:['squat','press','row','hinge','core','cardio'],reps:10,sets:3,progress:.02,metrics:['volume','cardio','adherence']},
 custom:{patterns:['squat','press','row','biceps','core'],reps:8,sets:3,progress:.025,metrics:['priorities','volume']},
};
