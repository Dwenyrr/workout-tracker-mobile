import * as SQLite from 'expo-sqlite';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

//Database initalization
let db : SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async () : Promise<void> => {
    try {
        db = await SQLite.openDatabaseAsync('workoutTracker.db');
        await db.execAsync(`CREATE TABLE IF NOT EXISTS workouts1 (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            workoutPlanId INTEGER NOT NULL,
            exercises TEXT NOT NULL,
            photo TEXT
            )`
        );
        await db.execAsync(`CREATE TABLE IF NOT EXISTS workoutPlans1 (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            exercises TEXT NOT NULL
            )`
        );
        console.log('Database initialized');
    } catch (err : any ) {
        console.error('Error creating database', err);
    }
};

//Thunk functions
//Fetch all workouts from the database
export const fetchWorkouts = createAsyncThunk('workoutList/fetchWorkouts', async () => {
    if (!db) {
        console.error('Database not initialized');
        return [];
    }

    try {
        const result : Workout[] = await db.getAllAsync('SELECT * FROM workouts1');

        return result.map((row : any) => ({
            id: row.id,
            name: row.name,
            date: row.date,
            workoutPlanId: row.workoutPlanId,
            exercises: JSON.parse(row.exercises),
            photo: row.photo
        }))
    } catch (err : any) {
        console.log('Error fetching workouts', err);
        return [];
    }
});

//fetch all workout plans from the database
export const fetchWorkoutPlans = createAsyncThunk('workoutList/fetchWorkoutPlans', async () => {
    if (!db) {
        console.error('Database not initialized');
        return [];
    }

    try {
        const result : WorkoutPlan[] = await db.getAllAsync('SELECT * FROM workoutPlans1');

        return result.map((row : any) => ({
            id: row.id,
            name: row.name,
            date: row.date,
            exercises: JSON.parse(row.exercises)
        }))
    } catch (err : any) {
        console.log('Error fetching workout plans', err);
        return [];
    }
});

//Save a workout to the database
export const saveWorkout = createAsyncThunk('workoutList/saveWorkout', async (workout : Workout) => {

    if (!db) {
        console.error('Database not initialized');
        return;
    }

    try {
        await db.runAsync(
            'INSERT INTO workouts1 (id, name, date, workoutPlanId, exercises, photo) VALUES (?, ?, ?, ?, ?, ?)',
            [workout.id, workout.name, workout.date, workout.workoutPlanId, JSON.stringify(workout.exercises), workout.photo]
        );

    } catch (err : any) {
        console.log('Error saving workout', err);
    }
});

//Save a workout plan to the database
export const saveWorkoutPlan = createAsyncThunk('workoutList/saveWorkoutPlan', async (workoutPlan : WorkoutPlan) => {
    if (!db) {
        console.error('Database not initialized');
        return;
    }

    try {
        await db.runAsync(
            'INSERT INTO workoutPlans1 (id, name, date, exercises) VALUES (?, ?, ?, ?)',
            [workoutPlan.id, workoutPlan.name, workoutPlan.date, JSON.stringify(workoutPlan.exercises)]
        );

    } catch (err : any) {
        console.log('Error saving workout plan', err);
    }
});

//Delete a workout from the database
export const deleteWorkout = createAsyncThunk('workoutList/deleteWorkout', async (workoutId : string) => {
    if (!db) {
        console.error('Database not initialized');
        return;
    }

    try {
        await db.runAsync('DELETE FROM workouts1 WHERE id = ?', [workoutId]);
        console.log('Workout deleted succesfully');
    } catch (err : any) {
        console.log('Error deleting workout', err);
    }
});

// Delete a workout plan from the database
export const deleteWorkoutPlan = createAsyncThunk('workoutList/deleteWorkoutPlan', async (workoutPlanId : string) => {
    if (!db) {
        console.error('Database not initialized');
        return;
    }

    try {
        await db.runAsync('DELETE FROM workoutPlans1 WHERE id = ?', [workoutPlanId]);
        console.log('Workout plan deleted succesfully');
    } catch (err : any) {
        console.log('Error deleting workout plan', err);
    }
});

export interface ExerciseSet {
    reps?: string;
    weight?: string;
}

export interface Exercise {
    id: string;
    name: string;
    amountOfSets: number;
    sets: ExerciseSet[];
}

export interface WorkoutPlan {
    id: string;
    name: string;
    date: string;
    exercises: Exercise[];
}

export interface Workout {
    id: string;
    date: string;
    name: string;
    workoutPlanId: string;
    exercises: Exercise[];
    photo: string;
}

interface State {
    workouts: Workout[];
    currentWorkout?: Workout;
    workoutPlans?: WorkoutPlan[];
    currentWorkoutPlan?: WorkoutPlan;
}

const workouts : Workout[] = [];
const workoutPlans : WorkoutPlan[] = [];

export const workoutSlice = createSlice({
    name : 'workoutList',
    initialState : {
        workouts : [...workouts],
        workoutPlans: [...workoutPlans],
        currentWorkout: undefined,
        currentWorkoutPlan: undefined,
    } as State,
    reducers: {
        // Create a new workout plan
        addCurrentWorkoutPlan: (state : State, action : PayloadAction<string>) => {
            state.currentWorkoutPlan = {
                id: uuid.v4(),
                name: action.payload,
                date: new Date().toISOString(),
                exercises: []
            }
        },
        // Add an exercise to the current workout plan
        addExerciseToCurrentWorkoutPlan: (state : State, action : PayloadAction<Exercise>) => {
            if (state.currentWorkoutPlan) {
                state.currentWorkoutPlan.exercises = [...state.currentWorkoutPlan.exercises, action.payload];
            }
        },
        // Start a new workout for a given workout plan
        startNewWorkout: (state : State, action : PayloadAction<string>) => {
            const selectedPlan : WorkoutPlan | undefined = state.workoutPlans?.find((plan) => plan.id === action.payload);
            if (selectedPlan) {
                state.currentWorkout = {
                    id: uuid.v4(),
                    date: new Date().toISOString(),
                    name: selectedPlan.name + " - " + new Date().toLocaleDateString(),
                    workoutPlanId: selectedPlan.id,
                    exercises: selectedPlan.exercises.map((exercise) => ({
                        ...exercise,
                        sets: Array.from({ length: exercise.amountOfSets }, () => ({ reps: '', weight: '' })),
                    })),
                    photo: "",
                }
            }
        },
        // Update a set for a given exercise
        updateExerciseSet: (state : State, action: PayloadAction<{ exerciseId: string, sets: ExerciseSet[] }>) => {
            if (state.currentWorkout) {
                const exercise : Exercise | undefined = state.currentWorkout.exercises
                                                        .find((exercise) => exercise.id === action.payload.exerciseId);
                if (exercise) {
                    exercise.sets = action.payload.sets;
                    }
                }
        },
        // Add a progress photo to the current workout
        addProgressPhoto: (state : State, action : PayloadAction<string>) => {
            if (state.currentWorkout) {
                state.currentWorkout.photo = action.payload;
            }
        },
        // Delete an exercise from the current workout plan
        deleteExercise: (state : State, action : PayloadAction<string>) => {
            if (state.currentWorkoutPlan) {
                state.currentWorkoutPlan.exercises = state.currentWorkoutPlan.exercises.filter((exercise) => exercise.id !== action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWorkouts.fulfilled, (state: State, action : PayloadAction<Workout[]>) => {
            state.workouts = action.payload.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }).addCase(fetchWorkoutPlans.fulfilled, (state : State, action : PayloadAction<WorkoutPlan[]>) => {
            state.workoutPlans = action.payload.sort((a, b) => a.name.localeCompare(b.name));
        }).addCase(saveWorkout.fulfilled, (state : State, action : PayloadAction<any>) => {
            state.currentWorkout = undefined;
            console.log('Workout saved');
        }).addCase(saveWorkoutPlan.fulfilled, (state : State, action : PayloadAction<any>) => {
            state.currentWorkoutPlan = undefined;
            console.log('Workout plan saved');
        });
    }
});

export const {
    startNewWorkout,
    updateExerciseSet,
    addProgressPhoto,
    addCurrentWorkoutPlan,
    addExerciseToCurrentWorkoutPlan,
    deleteExercise,
 } = workoutSlice.actions;

export default workoutSlice.reducer;