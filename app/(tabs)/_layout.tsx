import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { MasTabButton } from '@/components/mas-tab-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: Fonts.semiBold,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      {/* Tabs visibles */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="titulos"
        options={{
          title: 'Títulos',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="trophy.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="estadio"
        options={{
          title: 'Estadio',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="mappin.and.ellipse" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mas"
        options={{
          title: 'Más',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="line.3.horizontal" color={color} />,
          tabBarButton: (props) => <MasTabButton {...props} />,
        }}
      />

      {/* Tabs ocultos — accesibles solo desde el menú "Más" */}
      <Tabs.Screen
        name="historia"
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="plantel"
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="goleadores"
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="camisetas"
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="entrenadores"
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
