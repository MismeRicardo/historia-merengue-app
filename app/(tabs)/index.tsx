import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FUNDACION = 1924;
const ANIO_ACTUAL = new Date().getFullYear();

const secciones = [
  { href: '/historia', icono: 'clock.fill' as const, titulo: 'Historia', desc: 'Desde 1924 hasta hoy' },
  { href: '/titulos', icono: 'trophy.fill' as const, titulo: 'Títulos', desc: '30 campeonatos nacionales' },
  { href: '/plantel', icono: 'person.3.fill' as const, titulo: 'Plantel', desc: 'Jugadores por temporada' },
  { href: '/estadio', icono: 'mappin.and.ellipse' as const, titulo: 'Estadio', desc: 'El Monumental de Ate' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
        <View style={styles.escudo}>
          <Text style={styles.escudoLetra}>U</Text>
        </View>
        <Text style={styles.clubNombre}>Club Universitario</Text>
        <Text style={styles.clubSubtitulo}>de Deportes</Text>
        <Text style={styles.clubAnio}>Fundado en {FUNDACION} · Lima, Perú</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{ANIO_ACTUAL - FUNDACION} años de gloria</Text>
        </View>
      </View>

      {/* Stats rápidos */}
      <View style={[styles.statsRow, { backgroundColor: isDark ? Universitario.grisOscuro : Universitario.cremaOscuro }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumero, { color: Universitario.rojo }]}>30</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Títulos{'\n'}Nacionales</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumero, { color: Universitario.rojo }]}>1924</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Año de{'\n'}Fundación</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumero, { color: Universitario.rojo }]}>80K</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Capacidad{'\n'}Estadio</Text>
        </View>
      </View>

      {/* Menú de secciones */}
      <Text style={[styles.seccionTitulo, { color: colors.text }]}>Explorar</Text>
      <View style={styles.grid}>
        {secciones.map((s) => (
          <Link key={s.href} href={s.href as any} asChild>
            <TouchableOpacity
              style={[styles.tarjeta, { backgroundColor: isDark ? Universitario.grisOscuro : Universitario.blanco }]}
              activeOpacity={0.8}
            >
              <View style={[styles.tarjetaIcono, { backgroundColor: Universitario.rojo }]}>
                <IconSymbol name={s.icono} size={28} color={Universitario.blanco} />
              </View>
              <Text style={[styles.tarjetaTitulo, { color: colors.text }]}>{s.titulo}</Text>
              <Text style={[styles.tarjetaDesc, { color: colors.icon }]}>{s.desc}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      {/* Cita del club */}
      <View style={[styles.cita, { backgroundColor: Universitario.rojo }]}>
        <Text style={styles.citaTexto}>"El equipo del pueblo,{'\n'}el club de todos los peruanos"</Text>
        <Text style={styles.citaFuente}>— Club Universitario de Deportes</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  escudo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Universitario.crema,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: Universitario.dorado,
  },
  escudoLetra: {
    fontSize: 42,
    fontWeight: '900',
    color: Universitario.rojo,
    lineHeight: 48,
  },
  clubNombre: {
    fontSize: 26,
    fontWeight: '800',
    color: Universitario.crema,
    letterSpacing: 0.5,
  },
  clubSubtitulo: {
    fontSize: 16,
    color: Universitario.cremaOscuro,
    marginBottom: 8,
  },
  clubAnio: {
    fontSize: 13,
    color: Universitario.cremaOscuro,
    opacity: 0.9,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: Universitario.dorado,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Universitario.negro,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumero: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, textAlign: 'center', marginTop: 4, opacity: 0.8 },
  statDivider: { width: 1, marginVertical: 4 },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  tarjeta: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tarjetaIcono: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tarjetaTitulo: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  tarjetaDesc: { fontSize: 12 },
  cita: {
    margin: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  citaTexto: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Universitario.crema,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },
  citaFuente: {
    fontSize: 12,
    color: Universitario.cremaOscuro,
    marginTop: 10,
    opacity: 0.9,
  },
});
