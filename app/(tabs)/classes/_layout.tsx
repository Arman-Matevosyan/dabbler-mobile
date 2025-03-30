import { Stack } from "expo-router";

export default function ClassesLayout () {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
        </Stack>
    )
}