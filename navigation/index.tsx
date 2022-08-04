/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import RegisterFormScreen from '../screens/RegisterForm';
import LogInScreen from '../screens/LogInScreen';
import AddInstallation from '../screens/AddInstallation';
import ModalScreen from '../screens/MeasurementsModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import MeasurementsTabScreen from '../screens/MeasurementsTabScreen';
import ResultsScreen from '../screens/ResultsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ProvidersReports from '../screens/ProvidersReports';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <WelcomeNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function WelcomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TabOne" component={LogInNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterForm" component={RegisterFormScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const LogInStack = createNativeStackNavigator();

function LogInNavigator() {
  return (
    <Stack.Navigator>
      <LogInStack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />
      <LogInStack.Screen name="Tabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      <LogInStack.Screen name="Installation" component={AddInstallation} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>

    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={MeasurementsTabScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Measurements',
          tabBarIcon: ({ color }) => <TabBarIcon name="rocket" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={ResultsScreen}
        options={{
          title: 'Results',
          tabBarIcon: ({ color }) => <TabBarIcon name="line-chart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Report"
        component={ProvidersReports}
        options={{
          title: 'Report',
          tabBarIcon: ({ color }) => <TabBarIcon name="file-text" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
