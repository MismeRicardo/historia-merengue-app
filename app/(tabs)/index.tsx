import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/constants/api';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FUNDACION = 1924;
const ANIO_ACTUAL = new Date().getFullYear();

type Partido = {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  competicion: string;
  goleadores_local: string[];
  goleadores_visitante: string[];
  proximo_partido?: boolean | string | number | null;
};

type TemporadaPartidosApi = {
  anio: number;
  partidos: Partido[];
};

const secciones = [
  { href: '/historia', icono: 'clock.fill' as const, titulo: 'Historia', desc: 'Desde 1924 hasta hoy' },
  { href: '/titulos', icono: 'trophy.fill' as const, titulo: 'Títulos', desc: '30 campeonatos nacionales' },
  { href: '/plantel', icono: 'person.3.fill' as const, titulo: 'Plantel', desc: 'Jugadores por temporada' },
  { href: '/estadio', icono: 'mappin.and.ellipse' as const, titulo: 'Estadio', desc: 'El Monumental de Ate' },
];

function formatFecha(valor: string): string {
  if (!valor) return 'Fecha por confirmar';
  const d = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(d.getTime())) return valor;
  return d.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function inicialesEquipo(nombre: string): string {
  if (!nombre) return 'EQ';
  const partes = nombre.split(' ').filter(Boolean);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return partes.slice(0, 3).map((p) => p[0]).join('').toUpperCase();
}

function esPartidoProximo(valor: unknown): boolean {
  if (valor === true || valor === 1) return true;
  if (typeof valor === 'string') {
    const v = valor.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 't' || v === 'yes' || v === 'si';
  }
  return false;
}

function obtenerTimeStamp(fecha: string): number {
  const t = new Date(`${fecha}T00:00:00`).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loadingPartidos, setLoadingPartidos] = useState(true);

  useEffect(() => {
    const cargarPartidos = async () => {
      setLoadingPartidos(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/partidos`);
        if (!res.ok) throw new Error('No se pudo cargar partidos');
        const data = (await res.json()) as TemporadaPartidosApi[];
        const todos = data
          .flatMap((t) => t.partidos ?? [])
          .map((p) => ({ ...p, proximo_partido: esPartidoProximo(p.proximo_partido) }));
        setPartidos(todos);
      } catch {
        setPartidos([]);
      } finally {
        setLoadingPartidos(false);
      }
    };

    cargarPartidos();
  }, []);

  const ultimoPartido = useMemo(() => {
    const jugados = partidos.filter((p) => !esPartidoProximo(p.proximo_partido));
    if (jugados.length === 0) return null;
    return [...jugados].sort((a, b) => obtenerTimeStamp(b.fecha) - obtenerTimeStamp(a.fecha))[0];
  }, [partidos]);

  const proximoPartido = useMemo(() => {
    const proximos = partidos.filter((p) => esPartidoProximo(p.proximo_partido));
    if (proximos.length === 0) return null;
    return [...proximos].sort((a, b) => obtenerTimeStamp(a.fecha) - obtenerTimeStamp(b.fecha))[0];
  }, [partidos]);

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
      <View style={[styles.statsRow, { backgroundColor: Universitario.cremaOscuro }]}>
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

      {/* Partidos */}
      <Text style={[styles.seccionTitulo, { color: colors.text }]}>Partidos</Text>

      {loadingPartidos ? (
        <View style={[styles.partidoCard, { backgroundColor: Universitario.blanco, alignItems: 'center' }]}>
          <ActivityIndicator size="small" color={Universitario.rojo} />
          <Text style={[styles.goleadorItem, { color: Universitario.grisMedio, marginTop: 8 }]}>
            Cargando partidos...
          </Text>
        </View>
      ) : (
        <>
          {/* Último partido */}
          <View style={[styles.partidoCard, { backgroundColor: Universitario.blanco }]}>
            <Text style={[styles.partidoTag, { color: Universitario.grisMedio }]}>
              {ultimoPartido ? `${ultimoPartido.competicion || 'Partido oficial'} · Último jugado` : 'Último jugado'}
            </Text>
            {ultimoPartido ? (
              <>
                <View style={styles.partidoFila}>
                  <View style={styles.equipoBloque}>
                    <View style={[styles.escudoMini, { backgroundColor: Universitario.rojo }]}>
                      <Text style={styles.escudoMiniLetra}>{inicialesEquipo(ultimoPartido.equipo_local)}</Text>
                    </View>
                    <Text style={[styles.equipoNombre, { color: colors.text }]} numberOfLines={2}>
                      {ultimoPartido.equipo_local}
                    </Text>
                  </View>
                  <View style={styles.marcadorBloque}>
                    <Text style={[styles.marcador, { color: colors.text }]}>
                      {ultimoPartido.goles_local} - {ultimoPartido.goles_visitante}
                    </Text>
                    <Text style={[styles.partidoFecha, { color: Universitario.grisMedio }]}>
                      {formatFecha(ultimoPartido.fecha)}
                    </Text>
                  </View>
                  <View style={styles.equipoBloque}>
                    <View style={[styles.escudoMini, { backgroundColor: Universitario.grisClaro }]}>
                      <Text style={[styles.escudoMiniLetra, { color: Universitario.negro }]}> 
                        {inicialesEquipo(ultimoPartido.equipo_visitante)}
                      </Text>
                    </View>
                    <Text style={[styles.equipoNombre, { color: colors.text }]} numberOfLines={2}>
                      {ultimoPartido.equipo_visitante}
                    </Text>
                  </View>
                </View>
                <View style={[styles.goleadoresFila, { borderTopColor: Universitario.cremaOscuro }]}>
                  <View style={styles.goleadoresColumna}>
                    {(ultimoPartido.goleadores_local ?? []).slice(0, 3).map((g, i) => (
                      <Text key={`local-${i}`} style={[styles.goleadorItem, { color: Universitario.grisMedio, textAlign: 'left' }]}>
                        ⚽ {g}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.goleadoresColumna}>
                    {(ultimoPartido.goleadores_visitante ?? []).slice(0, 3).map((g, i) => (
                      <Text key={`visitante-${i}`} style={[styles.goleadorItem, { color: Universitario.grisMedio, textAlign: 'right' }]}>
                        {g} ⚽
                      </Text>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <Text style={[styles.goleadorItem, { color: Universitario.grisMedio, textAlign: 'center' }]}>
                No hay partidos jugados para mostrar.
              </Text>
            )}
          </View>

          {/* Próximo partido */}
          <View style={[styles.partidoCard, { backgroundColor: Universitario.blanco }]}>
            <Text style={[styles.partidoTag, { color: Universitario.grisMedio }]}> 
              {proximoPartido ? `${proximoPartido.competicion || 'Partido oficial'} · Próximo partido` : 'Próximo partido'}
            </Text>
            {proximoPartido ? (
              <>
                <View style={styles.partidoFila}>
                  <View style={styles.equipoBloque}>
                    <View style={[styles.escudoMini, { backgroundColor: Universitario.rojo }]}>
                      <Text style={styles.escudoMiniLetra}>{inicialesEquipo(proximoPartido.equipo_local)}</Text>
                    </View>
                    <Text style={[styles.equipoNombre, { color: colors.text }]} numberOfLines={2}>
                      {proximoPartido.equipo_local}
                    </Text>
                  </View>
                  <View style={styles.marcadorBloque}>
                    <Text style={[styles.marcadorVs, { color: Universitario.grisMedio }]}>VS</Text>
                    <Text style={[styles.partidoFecha, { color: Universitario.grisMedio }]}>
                      {formatFecha(proximoPartido.fecha)}
                    </Text>
                  </View>
                  <View style={styles.equipoBloque}>
                    <View style={[styles.escudoMini, { backgroundColor: Universitario.grisClaro }]}>
                      <Text style={[styles.escudoMiniLetra, { color: Universitario.negro }]}> 
                        {inicialesEquipo(proximoPartido.equipo_visitante)}
                      </Text>
                    </View>
                    <Text style={[styles.equipoNombre, { color: colors.text }]} numberOfLines={2}>
                      {proximoPartido.equipo_visitante}
                    </Text>
                  </View>
                </View>
                <View style={[styles.goleadoresFila, { borderTopColor: Universitario.cremaOscuro }]}>
                  <Text style={[styles.goleadorItem, { color: Universitario.grisMedio }]}>Pendiente por jugar</Text>
                </View>
              </>
            ) : (
              <Text style={[styles.goleadorItem, { color: Universitario.grisMedio, textAlign: 'center' }]}>
                No hay próximo partido marcado.
              </Text>
            )}
          </View>
        </>
      )}

      {/* Menú de secciones */}
      <Text style={[styles.seccionTitulo, { color: colors.text }]}>Explorar</Text>
      <View style={styles.grid}>
        {secciones.map((s) => (
          <Link key={s.href} href={s.href as any} asChild>
            <TouchableOpacity
              style={[styles.tarjeta, { backgroundColor: Universitario.blanco }]}
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
        <Text style={styles.citaTexto}>{'\"El equipo del pueblo,\nel club de todos los peruanos\"'}</Text>
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
    fontFamily: Fonts.extraBold,
    color: Universitario.crema,
    letterSpacing: 0.5,
  },
  clubSubtitulo: {
    fontSize: 16,
    fontFamily: Fonts.medium,
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
  statNumero: { fontSize: 24, fontFamily: Fonts.black },
  statLabel: { fontSize: 11, fontFamily: Fonts.medium, textAlign: 'center', marginTop: 4, opacity: 0.8 },
  statDivider: { width: 1, marginVertical: 4 },
  seccionTitulo: {
    fontSize: 20,
    fontFamily: Fonts.bold,
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
  tarjetaTitulo: { fontSize: 16, fontFamily: Fonts.bold, marginBottom: 4 },
  tarjetaDesc: { fontSize: 12, fontFamily: Fonts.regular },
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
  partidoCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  partidoTag: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  partidoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equipoBloque: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  escudoMini: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  escudoMiniLetra: {
    fontSize: 14,
    fontFamily: Fonts.black,
    color: Universitario.crema,
  },
  equipoNombre: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  marcadorBloque: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  marcador: {
    fontSize: 28,
    fontFamily: Fonts.black,
    letterSpacing: 2,
  },
  marcadorVs: {
    fontSize: 20,
    fontFamily: Fonts.black,
    letterSpacing: 2,
  },
  partidoFecha: {
    fontSize: 11,
    fontFamily: Fonts.regular,
  },
  partidoHora: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  goleadoresFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  goleadoresColumna: {
    flex: 1,
    gap: 2,
  },
  goleadorItem: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});
