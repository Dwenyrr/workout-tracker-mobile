import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button, Card,  } from 'react-native-paper';
import uuid from 'react-native-uuid';
import { Exercise} from '../../redux/workoutSlice';
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { addExerciseToCurrentWorkoutPlan } from '../../redux/workoutSlice';

// Input component for adding exercises to the current workout plan
const ExerciseInput : React.FC = () : React.ReactElement => {

  const [exerciseName, setExerciseName] = useState<string>('');
  const [sets, setSets] = useState<string>('');

  const dispatch : AppDispatch = useDispatch();

  const handleAddExercise = () : void => {
    if (exerciseName && sets) {
      const newExercise : Exercise = {
        id: uuid.v4(),
        name: exerciseName,
        amountOfSets: parseInt(sets, 10),
        sets: [],
      };

      dispatch(addExerciseToCurrentWorkoutPlan(newExercise));

      setExerciseName('');
      setSets('');

    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <TextInput
          label="Exercise Name"
          value={exerciseName}
          onChangeText={setExerciseName}
          style={{ marginBottom: 10 }}
          mode='outlined'
        />
        <TextInput
          label="Sets"
          value={sets}
          onChangeText={setSets}
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleAddExercise} disabled={!exerciseName || !sets} style={{ borderRadius: 10 }}>
          Add Exercise
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 4,
    padding: 10,
    marginBottom: 10,
  }
});

export default ExerciseInput;

