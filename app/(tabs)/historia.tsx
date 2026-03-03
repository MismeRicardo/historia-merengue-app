import { Colors, Universitario } from '@/constants/theme';
import historiaData from '@/data/historia.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoriaScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

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
        {historiaData.map((evento, index) => {
          const esUltimo = index === historiaData.length - 1;
          return (
            <View key={evento.id} style={styles.eventoRow}>
              {/* Línea vertical + círculo */}
              <View style={styles.lineaColumna}>
                <View style={[styles.circulo, { backgroundColor: Universitario.rojo, borderColor: isDark ? Universitario.grisOscuro : Universitario.crema }]} />
                {!esUltimo && <View style={[styles.linea, { backgroundColor: Universitario.rojoOscuro }]} />}
              </View>

              {/* Contenido del evento */}
              <View style={[styles.tarjeta, { backgroundColor: isDark ? Universitario.grisOscuro : Universitario.blanco }]}>
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
        })}
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
    fontWeight: '800',
    color: Universitario.crema,
    marginBottom: 4,
  },
  headerSubtitulo: {
    fontSize: 14,
    color: Universitario.cremaOscuro,
    opacity: 0.9,
  },
  timeline: {
    paddingHorizontal: 16,
    paddingTop: 24,
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
    fontWeight: '700',
    color: Universitario.crema,
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  eventoDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
});
