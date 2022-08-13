/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  TabOne: undefined;
  RegisterForm: undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  Report: undefined;
  RegisterForm: undefined;
  Welcome: undefined;
  Tabs: undefined;
  Installation: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type CreateUserResponse = {
  token : string;
  username: string;
  id: string;
  role: string;
};

export type ErrorResponse = {
  reason : string;
};

export type Report = {
  upUsage : number;
  downUsage: number;
  upQuality: number;
  downQuality: number;
  timestamp: string;
  location_id: number;
  provider_id: number;
  user_id: number;
};

export interface DataReports  {
  dates: Array<string>;
  upUsageData: number[];
  downUsageData: number[];
  upQualityData: number[];
  downQualityData: number[];
}

export type Measurements = {
  data? : DataReports;
  error?: ErrorResponse
};

export interface InstallationData {
  id : number;
  name: string;
  publickey: number;
  providers: number;
  timestamp: string;
  location_id: number;
  provider_id: number;
  user_id: number;
};

export type Installation = {
  data? : InstallationData[];
  error?: ErrorResponse
};

export interface ProviderData {
  id : number;
  name: string;
  reason?: string;
};

export type Provider = {
  data? : ProviderData[];
  error?: ErrorResponse
};

export type ProvidersReports = {
  data? : Report[];
  error?: ErrorResponse
};
