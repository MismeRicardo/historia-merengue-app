import { Colors, Universitario } from '@/constants/theme';
import plantelData from '@/data/plantel.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const POSICIONES: Record<string, string> = {
    Portero: '🧤',
    Defensa: '🛡️',
    Mediocampista: '⚙️',
    Extremo: '⚡',
    Delantero: '⚽',
};

export default function PlantelScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    const [anioSeleccionado, setAnioSeleccionado] = useState(plantelData[0].anio);
    const plantelActual = plantelData.find((p) => p.anio === anioSeleccionado)!;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Encabezado */}
            <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.headerTitulo}>Planteles Históricos</Text>
                <Text style={styles.headerSubtitulo}>Jugadores por temporada</Text>
            </View>

            {/* Selector de año */}
            <Text style={[styles.seccionLabel, { color: colors.text }]}>Seleccionar temporada</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.aniosRow}>
                {plantelData.map((p) => {
                    const activo = p.anio === anioSeleccionado;
                    return (
                        <TouchableOpacity
                            key={p.anio}
                            onPress={() => setAnioSeleccionado(p.anio)}
                            style={[
                                styles.anioBtn,
                                { backgroundColor: activo ? Universitario.rojo : isDark ? Universitario.grisOscuro : Universitario.cremaOscuro },
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.anioBtnText, { color: activo ? Universitario.crema : colors.text }]}>
                                {p.anio}
                            </Text>
                            {p.campeon && <Text style={styles.campeonStar}>🏆</Text>}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Info del DT */}
            <View style={[styles.dtCard, { backgroundColor: isDark ? Universitario.grisOscuro : Universitario.blanco, borderLeftColor: Universitario.rojo }]}>
                <Text style={[styles.dtLabel, { color: colors.icon }]}>Director Técnico</Text>
                <Text style={[styles.dtNombre, { color: colors.text }]}>{plantelActual.dt}</Text>
                {plantelActual.campeon && (
                    <View style={[styles.campeonBadge, { backgroundColor: Universitario.dorado }]}>
                        <Text style={styles.campeonBadgeText}>🏆 Campeón {plantelActual.anio}</Text>
                    </View>
                )}
            </View>

            {/* Goleador */}
            <View style={[styles.goleadorCard, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.goleadorLabel}>⚽ Goleador de la temporada</Text>
                <Text style={styles.goleadorNombre}>{plantelActual.goleador}</Text>
            </View>

            {/* Lista de jugadores */}
            <Text style={[styles.seccionLabel, { color: colors.text }]}>Jugadores ({plantelActual.jugadores.length})</Text>
            {plantelActual.jugadores.map((j) => (
                <View key={j.id} style={[styles.jugadorCard, { backgroundColor: isDark ? Universitario.grisOscuro : Universitario.blanco }]}>
                    <View style={[styles.numero, { backgroundColor: Universitario.rojo }]}>
                        <Text style={styles.numeroText}>{j.numero}</Text>
                    </View>
                    <View style={styles.jugadorInfo}>
                        <Text style={[styles.jugadorNombre, { color: colors.text }]}>{j.nombre}</Text>
                        <Text style={[styles.jugadorPos, { color: colors.icon }]}>
                            {POSICIONES[j.posicion] ?? '👤'} {j.posicion}
                        </Text>
                    </View>
                    <View style={[styles.bandera, { backgroundColor: isDark ? '#3A3A3A' : Universitario.cremaOscuro }]}>
                        <Text style={[styles.banderaText, { color: colors.icon }]}>{j.nacionalidad}</Text>
                    </View>
                </View>
            ))}
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
    seccionLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
    },
    aniosRow: {
        paddingHorizontal: 16,
        gap: 10,
        paddingBottom: 4,
    },
    anioBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    anioBtnText: { fontSize: 15, fontWeight: '700' },
    campeonStar: { fontSize: 12 },
    dtCard: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 14,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    dtLabel: { fontSize: 12, marginBottom: 4 },
    dtNombre: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    campeonBadge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    campeonBadgeText: { fontSize: 12, fontWeight: '700', color: Universitario.negro },
    goleadorCard: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 14,
        padding: 16,
    },
    goleadorLabel: { fontSize: 12, color: Universitario.cremaOscuro, marginBottom: 4 },
    goleadorNombre: { fontSize: 18, fontWeight: '700', color: Universitario.crema },
    jugadorCard: {
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    numero: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    numeroText: { fontSize: 14, fontWeight: '800', color: Universitario.crema },
    jugadorInfo: { flex: 1 },
    jugadorNombre: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    jugadorPos: { fontSize: 12 },
    bandera: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    banderaText: { fontSize: 11, fontWeight: '500' },
});
