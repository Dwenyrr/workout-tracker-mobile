import { CameraCapturedPicture, CameraView, useCameraPermissions } from "expo-camera"
import { Router, useRouter } from "expo-router";
import { useRef } from "react";
import { View, StyleSheet } from "react-native"
import { Button, FAB, Text } from "react-native-paper"
import { useDispatch } from "react-redux";
import { addProgressPhoto } from "../redux/workoutSlice";
import { AppDispatch } from "../redux/store";

// Camera view to take a photo for the workout
const cameraView : React.FC = () : React.ReactElement => {

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const dispatch : AppDispatch = useDispatch();
    const router : Router = useRouter();

    // Take a photo, add it to the workout and navigate to the workout summary 
    const takePhoto = async () : Promise<void> => {
        if (cameraRef.current) {
            const photo : CameraCapturedPicture | undefined = await cameraRef.current.takePictureAsync();
            if (photo) {
                dispatch(addProgressPhoto(photo.uri));
                router.push('/workoutSummary');
            }
        }
    };

    return (
        <View style={styles.container}>
            {!permission?.granted 
            ? <View>
                <Text>No permission to access camera</Text>
                <Button
                    mode='contained'
                    onPress={requestPermission}
                >
                    Request Permission
                </Button>
            </View>
            : <CameraView style={styles.cameraContainer} ref={cameraRef} >
                <View style={styles.bottomContainer}>
                <FAB
                    icon='camera'
                    onPress={() => {takePhoto()}}
                    style={styles.buttonTakePhoto}
                />
                </View>
            </CameraView>
        }
        </View>
    )
}

const styles = StyleSheet.create({
    buttonTakePhoto : {
        borderRadius : 50,
    },
    bottomContainer : {
        position: 'absolute', 
        bottom: 20, 
        left: 0, 
        right: 0, 
        alignItems: 'center'
    },
    cameraContainer: {
        flex: 1, 
        width: '100%'
    },
    container : {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

export default cameraView;