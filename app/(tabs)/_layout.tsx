import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "coral",
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
      name="index"
      options={{
        title:"Mi casa",
        tabBarIcon: ({ color }) => <IconSymbol size = {28} name="house.fill" color={color} />,
      }}
      />
      <Tabs.Screen
      name="suministros"
      options={{
        title:"Suministros",
        tabBarIcon: ({ color }) => <IconSymbol size = {28} name="info.bubble" color={color} />,
      }}
      />
    </Tabs>
    </SafeAreaProvider>

  );
}
