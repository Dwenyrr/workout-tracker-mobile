import { Router, useRouter } from 'expo-router';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Card, PaperProvider, Text, Title } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Workout } from '../redux/workoutSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

//Front Page of the App
const App : React.FC = () : React.ReactElement => {

  const workouts : Workout[] = useSelector((state : RootState) => state.workoutList.workouts);
  const router : Router = useRouter();
 
  return (
      <PaperProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>

            <View style={styles.innerContainer}>
              <Title style={styles.title}>               
                  Welcome to RepPal
              </Title>

              <Text variant="titleMedium" style={styles.subtitle}>
                Are you ready to start training?
              </Text>

              <Button
                mode="contained"
                style={styles.startButton}
                onPress={() => router.push('/startWorkout')}
              >
                Start New Workout
              </Button>

              <Text variant="titleMedium" style={styles.latestWorkoutsTitle}>
                Latest Workouts:
              </Text>

              <ScrollView>
                <View style={styles.workoutList}>

                  {workouts.slice(0, 4).map((workout: Workout) => (
                    <Card key={workout.id} style={styles.workoutCard}>
                      <Card.Content>
                        <Text variant="titleSmall">{workout.name}</Text>
                      </Card.Content>
                    </Card>
                  ))}

                </View>
              </ScrollView>
              
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    marginBottom: 30,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
  },
  latestWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutList: {
    width: '100%',
    paddingHorizontal: 8,
  },
  workoutCard: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
});

export default App;

