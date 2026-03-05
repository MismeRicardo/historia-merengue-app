import { MasMenu } from '@/components/mas-menu';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export function MasTabButton(props: BottomTabBarButtonProps) {
    const [menuVisible, setMenuVisible] = useState(false);

    const handlePress = () => {
        if (process.env.EXPO_OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setMenuVisible(true);
    };

    return (
        <>
            <PlatformPressable
                {...props}
                onPress={handlePress}
            >
                {props.children}
            </PlatformPressable>
            <MasMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </>
    );
}
