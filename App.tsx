import React, { useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  FlatList
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// Importamos tus componentes nativos
import EmptyState from './src/components/EmptyState'; 
import AddProductModal from './src/components/AddProductModal';

// Base de datos simulada para la despensa
const PRODUCTOS_DISPONIBLES = {
  "1": { id: "1", nombre: "Leche Entera", categoria: "Lácteos", tipo: "Nevera" },
  "2": { id: "2", nombre: "Yogur Natural", categoria: "Lácteos", tipo: "Nevera" },
  "3": { id: "3", nombre: "Manzanas", categoria: "Frutas", tipo: "Fresco" },
  "4": { id: "4", nombre: "Pechuga de Pollo", categoria: "Carnes", tipo: "Nevera" },
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { width, height } = useWindowDimensions();

  // --- ESTADOS NUEVOS ---
  const [vistaActiva, setVistaActiva] = useState<'menu' | 'despensa'>('menu'); // Controla la pantalla actual
  const [modalVisible, setModalVisible] = useState(false); // Controla el modal de añadir producto
  const [nevera, setNevera] = useState<Record<string, number>>({}); // Estado de la despensa

  // Animaciones de la cortina
  const progresoAnim = useRef(new Animated.Value(0)).current;
  const escalaAnim = useRef(new Animated.Value(1)).current;

  const ejecutarTransicion = (destino: 'menu' | 'despensa') => {
    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(escalaAnim, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(escalaAnim, { toValue: 1, duration: 700, useNativeDriver: true })
      ])
    );

    // PASO A: Bajar la cortina
    Animated.timing(progresoAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      
      // PASO B: La cortina está abajo. Iniciamos latido y CAMBIAMOS LA VISTA por detrás
      latido.start();
      setVistaActiva(destino);
      
      // PASO C: Simulación de carga (1.5 segundos)
      setTimeout(() => {
        
        // PASO D: Detenemos latido y subimos la cortina
        latido.stop(); 
        Animated.timing(escalaAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        Animated.timing(progresoAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();

      }, 1500);
    });
  };

  // Lógica para añadir productos
  const handleAddProduct = (id: string) => {
    setNevera((prevNevera) => ({
      ...prevNevera,
      [id]: (prevNevera[id] || 0) + 1,
    }));
  };

  const productosEnNevera = Object.keys(nevera).map(id => ({
    ...PRODUCTOS_DISPONIBLES[id as keyof typeof PRODUCTOS_DISPONIBLES],
    cantidad: nevera[id]
  }));

  const posicionCortina = progresoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0], 
  });

  const theme = {
    bg: isDarkMode ? '#121212' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    header: isDarkMode ? '#1f1f1f' : '#FFFFFF',
    card: isDarkMode ? '#2c2c2c' : '#FFFFFF',
    border: isDarkMode ? '#444' : '#DDD',
    accent: '#6200EE'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* --- CORTINA --- */}
      <Animated.View style={[styles.cortina, { backgroundColor: theme.accent, top: posicionCortina, height: height }]}>
        <Animated.View style={{ transform: [{ scale: escalaAnim }] }}>
          <Text style={styles.textCortina}>NEVERITA</Text>
        </Animated.View>
      </Animated.View>

      {/* --- HEADER --- */}
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        {/* Si estamos en la despensa, el icono de usuario se convierte en un botón de "Atrás" */}
        <TouchableOpacity onPress={() => vistaActiva !== 'menu' ? ejecutarTransicion('menu') : null}>
          <Feather 
            name={vistaActiva === 'menu' ? "user" : "arrow-left"} 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          {vistaActiva === 'menu' ? "Mi App" : "La Despensa 🛒"}
        </Text>

        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* --- CONTENIDO DINÁMICO --- */}
      {vistaActiva === 'menu' ? (
        // VISTA 1: MENU DE TARJETAS
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Tarjeta 1: Despensa */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => ejecutarTransicion('despensa')}
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: width * 0.95, height: height * 0.25 }]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>Despensa</Text>
            <Text style={{ color: theme.text }}>Toca para gestionar tus productos</Text>
          </TouchableOpacity>

          {/* Tarjeta 2 y 3 (Dummy de muestra) */}
          {[2, 3].map((num) => (
            <TouchableOpacity 
              key={num} 
              activeOpacity={0.8}
              onPress={() => ejecutarTransicion('menu')}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: width * 0.95, height: height * 0.25 }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>Pantalla {num}</Text>
              <Text style={{ color: theme.text }}>Toca para ver la transición</Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      ) : (
        // VISTA 2: LA DESPENSA (MÓDULO DE PRODUCTOS)
        <View style={styles.despensaContainer}>
          {productosEnNevera.length === 0 ? (
            <EmptyState />
          ) : (
            <FlatList
              data={productosEnNevera}
              keyExtractor={(item) => item.id}
              style={{ width: '100%' }}
              renderItem={({ item }) => (
                <View style={[styles.productRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View>
                    <Text style={[styles.productName, { color: theme.text }]}>{item.nombre}</Text>
                    <Text style={styles.productCat}>{item.categoria} · {item.tipo}</Text>
                  </View>
                  <Text style={styles.productQty}>x{item.amount ?? item.cantidad}</Text>
                </View>
              )}
            />
          )}

          {/* Botón flotante para añadir producto */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Añadir Producto</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL (Disponible globalmente) */}
      <AddProductModal 
        visible={modalVisible}
        productos={PRODUCTOS_DISPONIBLES}
        nevera={nevera}
        onAdd={handleAddProduct}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cortina: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCortina: { color: 'white', fontWeight: '900', fontSize: 48, letterSpacing: 4 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingVertical: 20, alignItems: 'center' },
  card: { padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  
  // Estilos de la Despensa
  despensaContainer: { flex: 1, width: '100%', paddingHorizontal: 15, paddingTop: 10 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1 },
  productName: { fontSize: 16, fontWeight: '600' },
  productCat: { fontSize: 12, color: '#888', marginTop: 2 },
  productQty: { fontSize: 16, fontWeight: 'bold', color: '#6200EE' },
  addButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#6200EE', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 5 },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});