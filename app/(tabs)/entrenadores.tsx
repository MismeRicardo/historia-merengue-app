import { Colors, Fonts, Universitario } from '@/constants/theme';
import entrenadoresData from '@/data/entrenadores.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Periodo {
    desde: number;
    hasta: number | null;
}

interface Entrenador {
    id: number;
    nombre: string;
    nacionalidad: string;
    periodos: Periodo[];
    titulos: string[];
    partidos: number;
    descripcion: string;
    activo: boolean;
}

const BANDERAS: Record<string, string> = {
    'Perú': '🇵🇪',
    'Argentina': '🇦🇷',
    'Uruguay': '🇺🇾',
    'España': '🇪🇸',
    'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Colombia': '🇨🇴',
    'Brasil': '🇧🇷',
    'Chile': '🇨🇱',
};

function formatPeriodo(periodo: Periodo): string {
    return `${periodo.desde} – ${periodo.hasta ?? 'Presente'}`;
}

function totalAnios(periodos: Periodo[]): string {
    let meses = 0;
    for (const p of periodos) {
        const hasta = p.hasta ?? new Date().getFullYear();
        meses += (hasta - p.desde) * 12;
    }
    const anios = Math.floor(meses / 12);
    const resto = meses % 12;
    if (anios === 0) return `${resto} meses`;
    if (resto === 0) return `${anios} año${anios !== 1 ? 's' : ''}`;
    return `${anios} año${anios !== 1 ? 's' : ''} ${resto} m`;
}

export default function EntrenadoresScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Ordenar: activos primero, luego por último período más reciente
    const entrenadores = [...(entrenadoresData as Entrenador[])].sort((a, b) => {
        if (a.activo && !b.activo) return -1;
        if (!a.activo && b.activo) return 1;
        const aMax = Math.max(...a.periodos.map((p) => p.hasta ?? 9999));
        const bMax = Math.max(...b.periodos.map((p) => p.hasta ?? 9999));
        return bMax - aMax;
    });

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Encabezado */}
            <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.headerTitulo}>Entrenadores</Text>
                <Text style={styles.headerSubtitulo}>Directores técnicos históricos</Text>
            </View>

            {/* Stat rápida */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.statNum, { color: Universitario.rojo }]}>{entrenadores.length}</Text>
                    <Text style={[styles.statLabel, { color: Universitario.grisMedio }]}>Entrenadores</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.statNum, { color: Universitario.rojo }]}>
                        {entrenadores.reduce((s, e) => s + e.titulos.length, 0)}
                    </Text>
                    <Text style={[styles.statLabel, { color: Universitario.grisMedio }]}>Títulos</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.statNum, { color: Universitario.rojo }]}>
                        {entrenadores.reduce((s, e) => s + e.partidos, 0)}
                    </Text>
                    <Text style={[styles.statLabel, { color: Universitario.grisMedio }]}>Partidos</Text>
                </View>
            </View>

            {/* Lista de entrenadores */}
            <View style={styles.lista}>
                {entrenadores.map((dt) => {
                    const bandera = BANDERAS[dt.nacionalidad] ?? '🏳️';
                    return (
                        <View
                            key={dt.id}
                            style={[
                                styles.card,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                dt.activo && styles.cardActivo,
                            ]}
                        >
                            {/* Avatar inicial + badge activo */}
                            <View style={styles.cardLeft}>
                                <View style={[styles.avatar, { backgroundColor: dt.activo ? Universitario.rojo : Universitario.grisClaro }]}>
                                    <Text style={[styles.avatarLetra, { color: dt.activo ? Universitario.crema : Universitario.grisMedio }]}>
                                        {dt.nombre.charAt(0)}
                                    </Text>
                                </View>
                                {dt.activo && (
                                    <View style={styles.activoBadge}>
                                        <Text style={styles.activoBadgeText}>DT</Text>
                                    </View>
                                )}
                            </View>

                            {/* Info principal */}
                            <View style={styles.cardBody}>
                                <View style={styles.cardTitleRow}>
                                    <Text style={[styles.nombre, { color: colors.text }]}>{dt.nombre}</Text>
                                    <Text style={styles.bandera}>{bandera}</Text>
                                </View>

                                <Text style={[styles.nacionalidad, { color: Universitario.grisMedio }]}>
                                    {dt.nacionalidad} · {totalAnios(dt.periodos)}
                                </Text>

                                {/* Períodos */}
                                <View style={styles.periodosRow}>
                                    {dt.periodos.map((p, i) => (
                                        <View key={i} style={[styles.periodoPill, { backgroundColor: dt.activo ? Universitario.rojo + '18' : colors.background }]}>
                                            <Text style={[styles.periodoText, { color: dt.activo ? Universitario.rojo : Universitario.grisMedio }]}>
                                                {formatPeriodo(p)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                <Text style={[styles.descripcion, { color: colors.text }]}>
                                    {dt.descripcion}
                                </Text>

                                {/* Títulos */}
                                {dt.titulos.length > 0 && (
                                    <View style={styles.titulosContainer}>
                                        <Text style={[styles.titulosLabel, { color: Universitario.grisMedio }]}>
                                            🏆 {dt.titulos.length === 1 ? '1 título' : `${dt.titulos.length} títulos`}
                                        </Text>
                                        <View style={styles.titulosList}>
                                            {dt.titulos.map((t, i) => (
                                                <View key={i} style={[styles.tituloPill, { backgroundColor: Universitario.dorado + '22' }]}>
                                                    <Text style={[styles.tituloPillText, { color: Universitario.rojoOscuro }]}>{t}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Footer: partidos */}
                                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                                    <Text style={[styles.partidosText, { color: Universitario.grisMedio }]}>
                                        {dt.partidos} partidos dirigidos
                                    </Text>
                                </View>
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
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTitulo: {
        fontSize: 26,
        fontFamily: Fonts.black,
        color: Universitario.crema,
    },
    headerSubtitulo: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Universitario.crema,
        opacity: 0.8,
        marginTop: 2,
    },

    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 10,
    },
    statCard: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    statNum: {
        fontSize: 22,
        fontFamily: Fonts.black,
    },
    statLabel: {
        fontSize: 11,
        fontFamily: Fonts.regular,
        marginTop: 2,
    },

    lista: {
        paddingHorizontal: 20,
        gap: 14,
    },
    card: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        flexDirection: 'row',
        gap: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    cardActivo: {
        borderColor: Universitario.rojo,
        borderWidth: 1.5,
    },

    cardLeft: {
        alignItems: 'center',
        gap: 6,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLetra: {
        fontSize: 22,
        fontFamily: Fonts.black,
    },
    activoBadge: {
        backgroundColor: Universitario.rojo,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    activoBadgeText: {
        fontSize: 9,
        fontFamily: Fonts.black,
        color: Universitario.crema,
        letterSpacing: 0.5,
    },

    cardBody: {
        flex: 1,
        gap: 6,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    nombre: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        flex: 1,
    },
    bandera: {
        fontSize: 18,
    },
    nacionalidad: {
        fontSize: 12,
        fontFamily: Fonts.regular,
    },

    periodosRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    periodoPill: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    periodoText: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
    },

    descripcion: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        lineHeight: 18,
    },

    titulosContainer: {
        gap: 6,
    },
    titulosLabel: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
    },
    titulosList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tituloPill: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    tituloPillText: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
    },

    cardFooter: {
        borderTopWidth: 1,
        paddingTop: 8,
        marginTop: 2,
    },
    partidosText: {
        fontSize: 11,
        fontFamily: Fonts.regular,
    },
});
