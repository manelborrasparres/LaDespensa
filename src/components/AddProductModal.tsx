import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from "react-native";

// Definimos las estructuras de datos con TypeScript
interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  tipo: string;
}

interface AddProductModalProps {
  visible: boolean; // Controla si el modal se ve o no
  productos: Record<string, Producto>; // Objeto con tus productos disponibles
  nevera: Record<string, number>; // Objeto que guarda el ID del producto y su cantidad
  onAdd: (id: string) => void;
  onClose: () => void;
}

function AddProductModal({ visible, productos, nevera, onAdd, onClose }: AddProductModalProps) {
  const [search, setSearch] = useState("");

  // Filtrado de productos basado en la búsqueda
  const filtered = Object.values(productos).filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Fondo oscuro detrás del modal */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          
          {/* Cabecera del modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Añadir producto</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Cuerpo del modal */}
          <View style={styles.modalBody}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o categoría..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={(text) => setSearch(text)} // En React Native se usa onChangeText
              autoFocus
            />

            {/* Lista con scroll para los productos */}
            <ScrollView style={styles.prodList} keyboardShouldPersistTaps="handled">
              {filtered.length === 0 && (
                <Text style={styles.noResults}>Sin resultados</Text>
              )}
              
              {filtered.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.prodItem}
                  onPress={() => onAdd(p.id)}
                >
                  <View style={styles.prodItemInfo}>
                    <Text style={styles.prodItemName}>{p.nombre}</Text>
                    <Text style={styles.prodItemCat}>
                      {p.categoria} · {p.tipo}
                    </Text>
                  </View>

                  {/* Indicador de si ya existe en la nevera */}
                  {nevera[p.id] && (
                    <View style={styles.alreadyTag}>
                      <Text style={styles.alreadyTagText}>
                        {nevera[p.id]} en nevera
                      </Text>
                    </View>
                  )}
                  
                  <Text style={styles.addPlus}>+</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

        </SafeAreaView>
      </View>
    </Modal>
  );
}

// Estilos móviles equivalentes a tus antiguas clases CSS
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Efecto translúcido de fondo
    justifyContent: "flex-end", // El modal subirá desde abajo como en las apps modernas
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%", // Para que no tape toda la pantalla completa
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeBtn: {
    padding: 5,
  },
  closeBtnText: {
    fontSize: 18,
    color: "#999",
  },
  modalBody: {
    padding: 20,
    flex: 1,
  },
  searchInput: {
    backgroundColor: "#F0F2F5",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 15,
    color: "#333",
  },
  prodList: {
    marginBottom: 20,
  },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  prodItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  prodItemInfo: {
    flex: 1,
  },
  prodItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  prodItemCat: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  alreadyTag: {
    backgroundColor: "#E6F4FE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 10,
  },
  alreadyTagText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "600",
  },
  addPlus: {
    fontSize: 22,
    color: "#007AFF",
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
});

export default AddProductModal;