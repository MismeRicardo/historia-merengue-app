import { Colors, Universitario } from '@/constants/theme';
import titulosData from '@/data/titulos.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TitulosScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    const decadas = titulosData.nacional.reduce<Record<string, typeof titulosData.nacional>>((acc, t) => {
        const decada = `${Math.floor(t.anio / 10) * 10}s`;
        if (!acc[decada]) acc[decada] = [];
        acc[decada].push(t);
        return acc;
    }, {});

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Encabezado */}
            <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.headerTrofeo}>🏆</Text>
                <Text style={styles.headerTitulo}>Palmarés</Text>
                <Text style={styles.headerSubtitulo}>El club más ganador del Perú</Text>
                <View style={styles.totalBadge}>
                    <Text style={styles.totalNumero}>{titulosData.resumen.totalNacionales}</Text>
                    <Text style={styles.totalLabel}>Títulos Nacionales</Text>
                </View>
            </View>

            {/* Internacionales */}
            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Logros Internacionales</Text>
            {titulosData.internacional.map((t, i) => (
                <View key={i} style={[styles.intCard, { backgroundColor: isDark ? Universitario.grisOscuro : Universitario.blanco, borderLeftColor: Universitario.dorado }]}>
                    <View style={styles.intCardHeader}>
                        <Text style={[styles.intAnio, { color: Universitario.dorado }]}>{t.anio}</Text>
                        <View style={[styles.rondaBadge, { backgroundColor: Universitario.dorado }]}>
                            <Text style={styles.rondaText}>{t.ronda}</Text>
                        </View>
                    </View>
                    <Text style={[styles.intComp, { color: colors.text }]}>{t.competicion}</Text>
                    <Text style={[styles.intDesc, { color: colors.icon }]}>{t.descripcion}</Text>
                </View>
            ))}

            {/* Nacionales por décadas */}
            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Campeonatos por Década</Text>
            {Object.entries(decadas).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([decada, titulos]) => (
                <View key={decada} style={[styles.decadaCard, { backgroundColor: isDark ? Universitario.grisOscuro : Universitario.blanco }]}>
                    <View style={styles.decadaHeader}>
                        <Text style={[styles.decadaLabel, { color: Universitario.rojo }]}>{decada}</Text>
                        <View style={[styles.decadaCount, { backgroundColor: Universitario.rojo }]}>
                            <Text style={styles.decadaCountText}>{titulos.length}</Text>
                        </View>
                    </View>
                    <View style={styles.aniosGrid}>
                        {titulos.map((t, i) => (
                            <View key={i} style={[styles.anioBadge, { backgroundColor: isDark ? '#3A3A3A' : Universitario.cremaOscuro }]}>
                                <Text style={[styles.anioNum, { color: colors.text }]}>{t.anio}</Text>
                            </View>
                        ))}
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
        alignItems: 'center',
    },
    headerTrofeo: { fontSize: 48, marginBottom: 8 },
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
        marginBottom: 16,
    },
    totalBadge: {
        backgroundColor: Universitario.dorado,
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
    },
    totalNumero: {
        fontSize: 36,
        fontWeight: '900',
        color: Universitario.negro,
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Universitario.negro,
    },
    seccionTitulo: {
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    intCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    intCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    intAnio: { fontSize: 18, fontWeight: '800' },
    rondaBadge: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    rondaText: { fontSize: 11, fontWeight: '700', color: Universitario.negro },
    intComp: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    intDesc: { fontSize: 13, lineHeight: 18 },
    decadaCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    decadaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    decadaLabel: { fontSize: 18, fontWeight: '800' },
    decadaCount: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    decadaCountText: { fontSize: 13, fontWeight: '700', color: Universitario.crema },
    aniosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    anioBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
    anioNum: { fontSize: 13, fontWeight: '600' },
});
