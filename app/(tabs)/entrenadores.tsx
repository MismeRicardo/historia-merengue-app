import { API_BASE_URL } from '@/constants/api';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
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
    titulos: number;
    descripcion: string;
    activo: boolean;
}

const BANDERAS: Record<string, string> = {
    'Perú': '🇵🇪',
    'Peru': '🇵🇪',
    'Argentina': '🇦🇷',
    'Uruguay': '🇺🇾',
    'España': '🇪🇸',
    'Inglaterra': '🏴',
    'Colombia': '🇨🇴',
    'Brasil': '🇧🇷',
    'Chile': '🇨🇱',
};

function formatPeriodo(periodo: Periodo): string {
    if (periodo.hasta === periodo.desde) {
        return String(periodo.desde);
    }
    return `${periodo.desde} – ${periodo.hasta ?? 'Presente'}`;
}

function normalizarPais(pais: string): string {
    return pais
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

export default function EntrenadoresScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroOtros, setFiltroOtros] = useState<'todos' | 'conTitulos' | 'sinTitulos'>('todos');

    const cargarEntrenadores = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/entrenadores`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = (await res.json()) as Entrenador[];
            setEntrenadores(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error de conexion');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEntrenadores();
    }, []);

    const entrenadoresOrdenados = useMemo(
        () =>
            [...entrenadores].sort((a, b) => {
                if (a.activo && !b.activo) return -1;
                if (!a.activo && b.activo) return 1;
                const aMax = Math.max(...a.periodos.map((p) => p.hasta ?? 9999));
                const bMax = Math.max(...b.periodos.map((p) => p.hasta ?? 9999));
                return bMax - aMax;
            }),
        [entrenadores]
    );

    const entrenadorActual = useMemo(
        () => entrenadoresOrdenados.find((entrenador) => entrenador.activo) ?? null,
        [entrenadoresOrdenados]
    );

    const otrosEntrenadores = useMemo(() => {
        const base = entrenadorActual
            ? entrenadoresOrdenados.filter((entrenador) => entrenador.id !== entrenadorActual.id)
            : entrenadoresOrdenados;

        if (filtroOtros === 'conTitulos') return base.filter((entrenador) => entrenador.titulos > 0);
        if (filtroOtros === 'sinTitulos') return base.filter((entrenador) => entrenador.titulos === 0);
        return base;
    }, [entrenadoresOrdenados, entrenadorActual, filtroOtros]);

    const textoFiltro =
        filtroOtros === 'todos'
            ? 'Filtrar: Todos'
            : filtroOtros === 'conTitulos'
                ? 'Filtrar: Con titulos'
                : 'Filtrar: Sin titulos';

    const cambiarFiltroOtros = () => {
        setFiltroOtros((previo) =>
            previo === 'todos' ? 'conTitulos' : previo === 'conTitulos' ? 'sinTitulos' : 'todos'
        );
    };

    const renderEntrenadorCard = (entrenador: Entrenador) => {
        const nacionalidad = entrenador.nacionalidad?.trim() || 'Sin nacionalidad';
        const banderaDirecta = BANDERAS[nacionalidad];
        const keyCompat = Object.keys(BANDERAS).find(
            (key) => normalizarPais(key) === normalizarPais(nacionalidad)
        );
        const bandera = banderaDirecta ?? (keyCompat ? BANDERAS[keyCompat] : '🏳️');

        return (
            <View
                key={entrenador.id}
                style={[
                    styles.card,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    entrenador.activo && styles.cardActivo,
                ]}
            >
                <View style={styles.cardLeft}>
                    <View
                        style={[
                            styles.avatar,
                            {
                                backgroundColor: entrenador.activo
                                    ? Universitario.rojo
                                    : Universitario.grisClaro,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.avatarLetra,
                                {
                                    color: entrenador.activo
                                        ? Universitario.crema
                                        : Universitario.grisMedio,
                                },
                            ]}
                        >
                            {entrenador.nombre.charAt(0)}
                        </Text>
                    </View>
                    {entrenador.activo && (
                        <View style={styles.activoBadge}>
                            <Text style={styles.activoBadgeText}>DT</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.cardTitleRow}>
                        <Text style={[styles.nombre, { color: colors.text }]}>{entrenador.nombre}</Text>
                        <Text style={styles.bandera}>{bandera}</Text>
                    </View>

                    <Text style={[styles.nacionalidad, { color: Universitario.grisMedio }]}>
                        {nacionalidad}
                    </Text>

                    <View style={styles.periodosRow}>
                        {entrenador.periodos.map((periodo, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.periodoPill,
                                    {
                                        backgroundColor: entrenador.activo
                                            ? Universitario.rojo + '18'
                                            : colors.background,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.periodoText,
                                        {
                                            color: entrenador.activo
                                                ? Universitario.rojo
                                                : Universitario.grisMedio,
                                        },
                                    ]}
                                >
                                    {formatPeriodo(periodo)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[styles.descripcion, { color: colors.text }]}>
                        {entrenador.descripcion}
                    </Text>

                    {entrenador.titulos > 0 && (
                        <View style={styles.titulosContainer}>
                            <Text style={[styles.titulosLabel, { color: Universitario.grisMedio }]}>
                                🏆 {entrenador.titulos === 1 ? '1 título' : `${entrenador.titulos} títulos`}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.headerTitulo}>Entrenadores</Text>
                <Text style={styles.headerSubtitulo}>Directores técnicos históricos</Text>
            </View>

            <View style={styles.lista}>
                {loading ? (
                    <View style={styles.estadoContainer}>
                        <ActivityIndicator size="large" color={Universitario.rojo} />
                        <Text style={[styles.estadoTexto, { color: colors.icon }]}>Cargando entrenadores...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.estadoContainer}>
                        <Text style={styles.estadoEmoji}>⚠️</Text>
                        <Text style={[styles.estadoTitulo, { color: colors.text }]}>Sin conexión</Text>
                        <Text style={[styles.estadoTexto, { color: Universitario.grisMedio }]}>No pudimos cargar entrenadores.</Text>
                        <TouchableOpacity
                            style={styles.reintentarBtn}
                            onPress={cargarEntrenadores}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.reintentarText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : entrenadoresOrdenados.length === 0 ? (
                    <View style={styles.estadoContainer}>
                        <Text style={styles.estadoEmoji}>📋</Text>
                        <Text style={[styles.estadoTitulo, { color: colors.text }]}>Sin entrenadores</Text>
                        <Text style={[styles.estadoTexto, { color: Universitario.grisMedio }]}>Aún no hay entrenadores registrados.</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.seccionHeader}>
                            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Entrenador actual</Text>
                        </View>

                        {entrenadorActual ? (
                            renderEntrenadorCard(entrenadorActual)
                        ) : (
                            <View
                                style={[
                                    styles.sinActualCard,
                                    { backgroundColor: colors.card, borderColor: colors.border },
                                ]}
                            >
                                <Text style={[styles.sinActualText, { color: Universitario.grisMedio }]}>
                                    No hay entrenador marcado como activo.
                                </Text>
                            </View>
                        )}

                        <View style={styles.otrosHeader}>
                            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Otros entrenadores</Text>
                            <TouchableOpacity
                                style={[
                                    styles.filtroBtn,
                                    { backgroundColor: colors.card, borderColor: colors.border },
                                ]}
                                onPress={cambiarFiltroOtros}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.filtroBtnText, { color: Universitario.rojo }]}>
                                    {textoFiltro}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {otrosEntrenadores.length === 0 ? (
                            <View
                                style={[
                                    styles.sinActualCard,
                                    { backgroundColor: colors.card, borderColor: colors.border },
                                ]}
                            >
                                <Text style={[styles.sinActualText, { color: Universitario.grisMedio }]}>
                                    No hay entrenadores para este filtro.
                                </Text>
                            </View>
                        ) : (
                            otrosEntrenadores.map((entrenador) => renderEntrenadorCard(entrenador))
                        )}
                    </>
                )}
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

    lista: {
        paddingHorizontal: 20,
        gap: 14,
    },
    seccionHeader: {
        marginTop: 8,
        marginBottom: 2,
    },
    seccionTitulo: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    otrosHeader: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    filtroBtn: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    filtroBtnText: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
    },
    sinActualCard: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
    },
    sinActualText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
    },
    estadoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
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
});
