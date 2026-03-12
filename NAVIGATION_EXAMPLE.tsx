/**
 * React Navigation Integration Example
 * Hướng dẫn chi tiết cách tích hợp module @spiral/rn-form với React Navigation
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SFormList, SFormResult } from '@spiral/rn-form';
import type { FormListItem } from '@spiral/rn-form';

// ============================================================
// Navigation Types (TypeScript)
// ============================================================

export type RootStackParamList = {
  FormList: {
    shopId: number;              // Shop ID cần thiết
    shopName?: string;           // Tên shop (optional)
  };
  FormDetail: {
    formId: string;              // Form ID for display
    formKey: string;             // AccessKey - KEY để fetch
    shopId: number;              // Shop ID
    formName: string;            // Tên form hiển thị header
    fromDate?: number;           // Optional
    toDate?: number;             // Optional
  };
};

// Screen Props
type FormListScreenProps = NativeStackScreenProps<RootStackParamList, 'FormList'>;
type FormDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'FormDetail'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

// ============================================================
// API Config (shared)
// ============================================================

/**
 * API Configuration
 * - baseUrl: Backend URL
 * - token: Authorization header (REQUIRED)
 *   Format: "Bearer {your-token}"
 *   Sẽ được gửi lên header: Authorization: Bearer xxx
 */
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  token: 'Bearer your-token-here',  // ← Authorization: Bearer {token}
};

// ============================================================
// Screen 1: Form List
// ============================================================
function FormListScreen({ route, navigation }: FormListScreenProps) {
  const { shopId, shopName } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: shopName || 'Danh sách khảo sát',
    });
  }, [navigation, shopName]);

  const handleSelectForm = (formKey: string, shopId: number, item: FormListItem) => {
    navigation.navigate('FormDetail', {
      formId: item.Id.toString(),
      formKey: item.AccessKey,     // KEY để fetch
      shopId: shopId,
      formName: item.Title,
      fromDate: item.FromDate,
      toDate: item.ToDate,
    });
  };

  return (
    <SFormList
      shopId={shopId}
      apiConfig={apiConfig}
      onSelectForm={handleSelectForm}
    />
  );
}

// ============================================================
// Screen 2: Form Detail
// ============================================================
function FormDetailScreen({ route, navigation }: FormDetailScreenProps) {
  const { formId, formKey, shopId, formName } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: formName,
    });
  }, [navigation, formName]);

  const handleSubmitSuccess = (resultId: number) => {
    console.log('✅ Submit thành công, resultId:', resultId);
    
    // Option 1: Quay về list
    navigation.goBack();
    
    // Option 2: Show success screen
    // navigation.replace('FormSuccess', { resultId });
    
    // Option 3: Reset về home
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'FormList', params: { shopId } }],
    // });
  };

  const handleSubmitError = (message: string) => {
    console.error('❌ Submit error:', message);
    // Optional: Show error modal/alert
  };

  return (
    <SFormResult
      formId={formId}
      formKey={formKey}              // ƯU TIÊN cao nhất
      shopId={shopId}                // Auto-select shop
      apiConfig={apiConfig}
      displayMode="step"             // Step-by-step cho mobile
      onSubmitSuccess={handleSubmitSuccess}
      onSubmitError={handleSubmitError}
      onCameraCapture={(questionId, callback) => {
        console.log('📷 Open camera for question:', questionId);
        // Your camera logic
        // launchCamera({...}, (res) => {
        //   if (res.assets?.[0]?.uri) {
        //     callback(res.assets[0].uri);
        //   }
        // });
      }}
    />
  );
}

// ============================================================
// Navigator Setup
// ============================================================
export function SurveyNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4285F4',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="FormList"
        component={FormListScreen}
        initialParams={{ shopId: 123 }} // Default shop
        options={{
          title: 'Khảo sát',
        }}
      />
      <Stack.Screen
        name="FormDetail"
        component={FormDetailScreen}
        options={{
          title: 'Chi tiết',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack.Navigator>
  );
}

// ============================================================
// App Root
// ============================================================
export default function App() {
  return (
    <NavigationContainer>
      <SurveyNavigator />
    </NavigationContainer>
  );
}

// ============================================================
// Example 2: Navigate từ Home Screen
// ============================================================
type HomeStackParamList = {
  Home: undefined;
  FormList: { shopId: number; shopName?: string };
  FormDetail: {
    formId: string;
    formKey: string;
    shopId: number;
    formName: string;
  };
};

function HomeScreen({ navigation }: NativeStackScreenProps<HomeStackParamList, 'Home'>) {
  const currentShopId = 123; // Lấy từ context/auth
  const currentShopName = "Shop A";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('FormList', {
            shopId: currentShopId,
            shopName: currentShopName,
          });
        }}
      >
        <Text style={styles.buttonText}>Mở danh sách khảo sát</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================
// Example 3: Deep Link trực tiếp vào Form Detail
// ============================================================
function DirectLinkExample({ navigation }: any) {
  const openFormDirectly = () => {
    navigation.navigate('FormDetail', {
      formId: '374',
      formKey: '2d2775de-0c81-43eb-96d4-4f04a241821b',
      shopId: 123,
      formName: 'Test Form',
    });
  };

  return (
    <TouchableOpacity onPress={openFormDirectly}>
      <Text>Mở form trực tiếp</Text>
    </TouchableOpacity>
  );
}

// ============================================================
// Example 4: Tab Navigator với Form List
// ============================================================
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type TabParamList = {
  Home: undefined;
  Surveys: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function SurveysTab() {
  const shopId = 123; // Từ context
  const [selected, setSelected] = React.useState<any>(null);

  if (selected) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelected(null)}
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <SFormResult
          formId={selected.item.Id.toString()}
          formKey={selected.formKey}
          shopId={shopId}
          apiConfig={apiConfig}
          displayMode="step"
          onSubmitSuccess={() => setSelected(null)}
        />
      </View>
    );
  }

  return (
    <SFormList
      shopId={shopId}
      apiConfig={apiConfig}
      onSelectForm={(formKey, shopId, item) => {
        setSelected({ formKey, shopId, item });
      }}
    />
  );
}

export function TabNavigatorExample() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Surveys" 
        component={SurveysTab}
        options={{ title: 'Khảo sát' }}
      />
      <Tab.Screen name="Profile" component={() => <View />} />
    </Tab.Navigator>
  );
}

// ============================================================
// Example 5: Drawer Navigator
// ============================================================
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export function DrawerNavigatorExample() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Surveys">
        {() => <SurveyNavigator />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

// ============================================================
// Example 6: Navigation với Authentication
// ============================================================
function AuthenticatedSurveyNavigator() {
  // Get user info từ context
  const user = { shopId: 123, employeeId: 456, token: 'xxx' };

  const apiConfigWithAuth = {
    baseUrl: 'https://vnmmt.spiral.com.vn',
    token: `Bearer ${user.token}`,
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="FormList">
        {({ navigation }) => (
          <SFormList
            shopId={user.shopId}
            apiConfig={apiConfigWithAuth}
            onSelectForm={(formKey, shopId, item) => {
              navigation.navigate('FormDetail', {
                formId: item.Id.toString(),
                formKey: item.AccessKey,
                shopId: user.shopId,
                formName: item.Title,
              });
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="FormDetail" component={FormDetailScreen} />
    </Stack.Navigator>
  );
}

// ============================================================
// Navigation Helpers
// ============================================================

// Type-safe navigation helper
export const navigateToFormDetail = (
  navigation: any,
  params: {
    formId: string;
    formKey: string;
    shopId: number;
    formName: string;
  }
) => {
  navigation.navigate('FormDetail', params);
};

// Usage:
// navigateToFormDetail(navigation, {
//   formId: '374',
//   formKey: 'abc-123',
//   shopId: 123,
//   formName: 'Test Form',
// });

// ============================================================
// Params Summary
// ============================================================

/**
 * PARAMS CHEAT SHEET:
 * 
 * 1. Navigate TO FormList:
 * navigation.navigate('FormList', {
 *   shopId: number,        // REQUIRED
 *   shopName?: string,     // Optional
 * });
 * 
 * 2. Navigate TO FormDetail:
 * navigation.navigate('FormDetail', {
 *   formId: string,        // REQUIRED (display purposes)
 *   formKey: string,       // REQUIRED (AccessKey - KEY để fetch)
 *   shopId: number,        // REQUIRED (auto-select shop)
 *   formName: string,      // REQUIRED (header title)
 *   fromDate?: number,     // Optional
 *   toDate?: number,       // Optional
 * });
 * 
 * 3. onSelectForm callback trong SFormList:
 * onSelectForm={(formKey, shopId, item) => {
 *   navigation.navigate('FormDetail', {
 *     formId: item.Id.toString(),
 *     formKey: item.AccessKey,    // ← KEY này quan trọng
 *     shopId: shopId,
 *     formName: item.Title,
 *   });
 * }}
 * 
 * 4. Go Back từ FormDetail:
 * navigation.goBack();
 * 
 * 5. Reset navigation stack:
 * navigation.reset({
 *   index: 0,
 *   routes: [{ name: 'FormList', params: { shopId: 123 } }],
 * });
 */

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  backText: {
    fontSize: 16,
    color: '#4285F4',
    fontWeight: '600',
  },
});
