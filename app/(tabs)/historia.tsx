import { API_BASE_URL } from '@/constants/api';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type EventoHistoria = {
  id: number;
  anio: number;
  titulo: string;
  descripcion: string;
  icono: string;
};

export default function HistoriaScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [eventos, setEventos] = useState<EventoHistoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarHistoria = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/historia`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = (await res.json()) as EventoHistoria[];
      setEventos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistoria();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Encabezado */}
      <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
        <Text style={styles.headerTitulo}>Historia Crema</Text>
        <Text style={styles.headerSubtitulo}>Desde 1924, un siglo de gloria</Text>
      </View>

      {/* Línea de tiempo */}
      <View style={styles.timeline}>
        {loading ? (
          <View style={styles.estadoContainer}>
            <ActivityIndicator size="large" color={Universitario.rojo} />
            <Text style={[styles.estadoTexto, { color: colors.icon }]}>Cargando historia...</Text>
          </View>
        ) : error ? (
          <View style={styles.estadoContainer}>
            <Text style={styles.estadoEmoji}>⚠️</Text>
            <Text style={[styles.estadoTitulo, { color: colors.text }]}>Sin conexión</Text>
            <Text style={[styles.estadoTexto, { color: Universitario.grisMedio }]}>No pudimos cargar la historia.</Text>
            <TouchableOpacity style={styles.reintentarBtn} onPress={cargarHistoria} activeOpacity={0.8}>
              <Text style={styles.reintentarText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : eventos.length === 0 ? (
          <View style={styles.estadoContainer}>
            <Text style={styles.estadoEmoji}>📜</Text>
            <Text style={[styles.estadoTitulo, { color: colors.text }]}>Sin eventos históricos</Text>
            <Text style={[styles.estadoTexto, { color: Universitario.grisMedio }]}>Aún no hay historia registrada.</Text>
          </View>
        ) : (
          eventos.map((evento, index) => {
            const esUltimo = index === eventos.length - 1;
            return (
              <View key={evento.id} style={styles.eventoRow}>
                <View style={styles.lineaColumna}>
                  <View style={[styles.circulo, { backgroundColor: Universitario.rojo, borderColor: Universitario.crema }]} />
                  {!esUltimo && <View style={[styles.linea, { backgroundColor: Universitario.rojoOscuro }]} />}
                </View>

                <View style={[styles.tarjeta, { backgroundColor: Universitario.blanco }]}>
                  <View style={styles.tarjetaHeader}>
                    <View style={[styles.anioBadge, { backgroundColor: Universitario.rojo }]}>
                      <Text style={styles.anioText}>{evento.anio}</Text>
                    </View>
                  </View>
                  <Text style={[styles.eventoTitulo, { color: colors.text }]}>{evento.titulo}</Text>
                  <Text style={[styles.eventoDesc, { color: colors.icon }]}>{evento.descripcion}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  headerTitulo: {
    fontSize: 28,
    fontFamily: Fonts.black,
    color: Universitario.crema,
    marginBottom: 4,
  },
  headerSubtitulo: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Universitario.cremaOscuro,
    opacity: 0.9,
  },
  timeline: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  estadoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 8,
  },
  estadoEmoji: {
    fontSize: 34,
  },
  estadoTitulo: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
  estadoTexto: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  reintentarBtn: {
    marginTop: 6,
    backgroundColor: Universitario.rojo,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  reintentarText: {
    color: Universitario.crema,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  eventoRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  lineaColumna: {
    width: 32,
    alignItems: 'center',
  },
  circulo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    zIndex: 1,
    marginTop: 14,
  },
  linea: {
    width: 2,
    flex: 1,
    minHeight: 20,
  },
  tarjeta: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  tarjetaHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  anioBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  anioText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Universitario.crema,
  },
  eventoTitulo: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    marginBottom: 6,
  },
  eventoDesc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 19,
  },
});
