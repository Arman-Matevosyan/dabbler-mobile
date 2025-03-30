import { Stack } from "expo-router";

export default function CheckinLayout () {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
        </Stack>
    )
}