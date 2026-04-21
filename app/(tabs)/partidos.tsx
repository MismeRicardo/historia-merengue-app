import { API_BASE_URL } from '@/constants/api';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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

const ANIO_INICIO = 1928;
const ANIO_FIN = 2026;
const TODOS_LOS_ANIOS = Array.from({ length: ANIO_FIN - ANIO_INICIO + 1 }, (_, i) => ANIO_INICIO + i);

const DECADAS = Array.from(
    new Set(TODOS_LOS_ANIOS.map((a) => Math.floor(a / 10) * 10))
).map((dec) => ({
    label: `${dec}s`,
    anios: TODOS_LOS_ANIOS.filter((a) => Math.floor(a / 10) * 10 === dec),
}));

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
    const parts = nombre.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return parts.slice(0, 3).map((p) => p[0]).join('').toUpperCase();
}

function esUniversitario(nombre: string): boolean {
    return nombre.toLowerCase().includes('universitario');
}

function limpiarNombreGoleador(nombre: string): string {
    return nombre.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function esPartidoProximo(valor: unknown): boolean {
    if (valor === true || valor === 1) return true;
    if (typeof valor === 'string') {
        const v = valor.trim().toLowerCase();
        return v === 'true' || v === '1' || v === 't' || v === 'yes' || v === 'si';
    }
    return false;
}

export default function PartidosScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [temporadas, setTemporadas] = useState<TemporadaPartidosApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [anioSeleccionado, setAnioSeleccionado] = useState(ANIO_FIN);
    const [modalVisible, setModalVisible] = useState(false);

    const cargarPartidos = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/partidos`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = (await res.json()) as TemporadaPartidosApi[];
            const normalizado: TemporadaPartidosApi[] = data.map((t) => ({
                ...t,
                partidos: (t.partidos ?? []).map((p) => ({
                    ...p,
                    proximo_partido: esPartidoProximo(p.proximo_partido),
                })),
            }));
            setTemporadas(normalizado);
            const anioMasReciente = data.reduce((m, t) => Math.max(m, t.anio), 0);
            if (anioMasReciente > 0) setAnioSeleccionado(anioMasReciente);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPartidos();
    }, []);

    const ANIOS_CON_DATOS = useMemo(
        () => new Set(temporadas.map((t) => t.anio)),
        [temporadas]
    );

    const partidosAnio = useMemo(() => {
        const t = temporadas.find((x) => x.anio === anioSeleccionado);
        return t?.partidos ?? [];
    }, [temporadas, anioSeleccionado]);

    const partidosJugadosAnio = useMemo(
        () => partidosAnio.filter((p) => !esPartidoProximo(p.proximo_partido)),
        [partidosAnio]
    );

    const resumenTemporada = useMemo(() => {
        let ganados = 0;
        let empatados = 0;
        let perdidos = 0;
        let gf = 0;
        let gc = 0;

        const conteoGoleadores = new Map<string, { nombre: string; cantidad: number }>();

        for (const p of partidosJugadosAnio) {
            const univerEsLocal = esUniversitario(p.equipo_local);
            const univerEsVisitante = esUniversitario(p.equipo_visitante);

            const golesFavor = univerEsVisitante ? p.goles_visitante : p.goles_local;
            const golesContra = univerEsVisitante ? p.goles_local : p.goles_visitante;

            gf += golesFavor;
            gc += golesContra;

            if (golesFavor > golesContra) ganados += 1;
            else if (golesFavor === golesContra) empatados += 1;
            else perdidos += 1;

            const goleadoresU = univerEsLocal
                ? p.goleadores_local
                : univerEsVisitante
                    ? p.goleadores_visitante
                    : p.goleadores_local;

            for (const goleador of goleadoresU) {
                const limpio = limpiarNombreGoleador(goleador);
                if (!limpio) continue;
                const key = limpio.toLowerCase();
                const actual = conteoGoleadores.get(key);
                if (actual) {
                    actual.cantidad += 1;
                } else {
                    conteoGoleadores.set(key, { nombre: limpio, cantidad: 1 });
                }
            }
        }

        const goleadorTop = Array.from(conteoGoleadores.values()).sort((a, b) => b.cantidad - a.cantidad)[0];

        return {
            partidos: partidosJugadosAnio.length,
            ganados,
            empatados,
            perdidos,
            gf,
            gc,
            dif: gf - gc,
            goleadorTop,
        };
    }, [partidosJugadosAnio]);

    const seleccionarAnio = (anio: number) => {
        setAnioSeleccionado(anio);
        setModalVisible(false);
    };

    return (
        <>
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
            >
                <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                    <Text style={styles.headerTitulo}>Partidos</Text>
                    <Text style={styles.headerSubtitulo}>Resultados por temporada</Text>
                </View>

                <View style={styles.selectorRow}>
                    <TouchableOpacity
                        style={[styles.selectorBtn, { backgroundColor: Universitario.rojo }]}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.selectorBtnAnio}>{anioSeleccionado}</Text>
                        <Text style={styles.selectorBtnLabel}>▼ Cambiar temporada</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.estadoContainer}>
                        <ActivityIndicator size="large" color={Universitario.rojo} />
                        <Text style={[styles.estadoTexto, { color: colors.icon }]}>Cargando partidos...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.estadoContainer}>
                        <Text style={styles.estadoEmoji}>⚠️</Text>
                        <Text style={[styles.estadoTitulo, { color: colors.text }]}>Sin conexión</Text>
                        <Text style={[styles.estadoTexto, { color: Universitario.grisMedio }]}>No pudimos cargar los partidos.</Text>
                        <TouchableOpacity style={styles.reintentarBtn} onPress={cargarPartidos} activeOpacity={0.8}>
                            <Text style={styles.reintentarText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : partidosJugadosAnio.length > 0 ? (
                    <>
                        <View style={[styles.resumenCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.resumenTotal, { color: colors.text }]}>{resumenTemporada.partidos}</Text>
                            <Text style={[styles.resumenLabel, { color: colors.icon }]}>PARTIDOS</Text>

                            <View style={styles.resultadosRow}>
                                <View style={[styles.resultadoBox, styles.resultadoGanados, { borderColor: colors.border }]}>
                                    <Text style={styles.resultadoGanadosNum}>{resumenTemporada.ganados}</Text>
                                    <Text style={[styles.resultadoTxt, { color: colors.icon }]}>GANADOS</Text>
                                </View>
                                <View style={[styles.resultadoBox, styles.resultadoEmpatados, { borderColor: colors.border }]}>
                                    <Text style={styles.resultadoEmpatadosNum}>{resumenTemporada.empatados}</Text>
                                    <Text style={[styles.resultadoTxt, { color: colors.icon }]}>EMPATADOS</Text>
                                </View>
                                <View style={[styles.resultadoBox, styles.resultadoPerdidos, { borderColor: colors.border }]}>
                                    <Text style={styles.resultadoPerdidosNum}>{resumenTemporada.perdidos}</Text>
                                    <Text style={[styles.resultadoTxt, { color: colors.icon }]}>PERDIDOS</Text>
                                </View>
                            </View>

                            <View style={[styles.gfRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                                <View style={styles.gfCol}>
                                    <Text style={[styles.gfNum, { color: colors.text }]}>{resumenTemporada.gf}</Text>
                                    <Text style={[styles.gfLabel, { color: colors.icon }]}>GF</Text>
                                </View>
                                <View style={styles.gfCol}>
                                    <Text style={[styles.gfNum, { color: colors.text }]}>{resumenTemporada.gc}</Text>
                                    <Text style={[styles.gfLabel, { color: colors.icon }]}>GC</Text>
                                </View>
                                <View style={styles.gfCol}>
                                    <Text style={[styles.gfNum, { color: colors.text }]}>{resumenTemporada.dif >= 0 ? `+${resumenTemporada.dif}` : resumenTemporada.dif}</Text>
                                    <Text style={[styles.gfLabel, { color: colors.icon }]}>DIF</Text>
                                </View>
                            </View>

                            {resumenTemporada.goleadorTop && (
                                <View style={[styles.goleadorTopBox, { borderColor: colors.border }]}>
                                    <Text style={styles.goleadorTopTitulo}>Goleador:</Text>
                                    <Text style={[styles.goleadorTopNombre, { color: colors.text }]}>
                                        {resumenTemporada.goleadorTop.nombre}
                                    </Text>
                                    <Text style={[styles.goleadorTopCantidad, { color: colors.icon }]}>({resumenTemporada.goleadorTop.cantidad})</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.listaPartidos}>
                            {partidosJugadosAnio.map((p) => (
                                <View key={p.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    <View style={styles.cardMainRow}>
                                        <View style={styles.equipoCol}>
                                            <View style={styles.escudo}>
                                                <Text style={styles.escudoText}>{inicialesEquipo(p.equipo_local)}</Text>
                                            </View>
                                            <Text style={[styles.equipoNombre, { color: colors.text }]} numberOfLines={1}>{p.equipo_local}</Text>
                                        </View>

                                        <View style={styles.marcadorCol}>
                                            <Text style={[styles.marcador, { color: colors.text }]}>{p.goles_local} - {p.goles_visitante}</Text>
                                            <Text style={styles.competicion}>{p.competicion || 'Partido'}</Text>
                                            <Text style={[styles.fecha, { color: Universitario.grisMedio }]}>{formatFecha(p.fecha)}</Text>
                                        </View>

                                        <View style={styles.equipoCol}>
                                            <View style={styles.escudo}>
                                                <Text style={styles.escudoText}>{inicialesEquipo(p.equipo_visitante)}</Text>
                                            </View>
                                            <Text style={[styles.equipoNombre, { color: colors.text }]} numberOfLines={1}>{p.equipo_visitante}</Text>
                                        </View>
                                    </View>

                                    {(p.goleadores_local.length > 0 || p.goleadores_visitante.length > 0) && (
                                        <View style={[styles.golesExtra, { borderTopColor: colors.border }]}>
                                            <View style={styles.goleadoresRow}>
                                                <View style={styles.goleadoresColLocal}>
                                                    {p.goleadores_local
                                                        .filter((g) => g.trim().length > 0)
                                                        .map((g, idx) => (
                                                            <Text key={`l-${p.id}-${idx}`} style={[styles.golesText, { color: colors.icon }]}>
                                                                ⚽ {g}
                                                            </Text>
                                                        ))}
                                                </View>

                                                <View style={styles.goleadoresColVisitante}>
                                                    {p.goleadores_visitante
                                                        .filter((g) => g.trim().length > 0)
                                                        .map((g, idx) => (
                                                            <Text key={`v-${p.id}-${idx}`} style={[styles.golesText, { color: colors.icon }]}>
                                                                ⚽ {g}
                                                            </Text>
                                                        ))}
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.estadoContainer}>
                        <Text style={styles.estadoEmoji}>📅</Text>
                        <Text style={[styles.estadoTitulo, { color: colors.text }]}>Sin partidos registrados</Text>
                        <Text style={[styles.estadoTexto, { color: Universitario.grisMedio }]}>No hay partidos cargados para {anioSeleccionado}.</Text>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitulo, { color: colors.text }]}>Seleccionar Año</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                                <Text style={[styles.modalCerrar, { color: Universitario.rojo }]}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={DECADAS}
                            keyExtractor={(item) => item.label}
                            contentContainerStyle={styles.modalLista}
                            renderItem={({ item: decada }) => (
                                <View style={styles.decadaBloque}>
                                    <Text style={[styles.decadaLabel, { color: Universitario.rojo }]}>{decada.label}</Text>
                                    <View style={styles.aniosGrid}>
                                        {decada.anios.map((anio) => {
                                            const tieneDatos = ANIOS_CON_DATOS.has(anio);
                                            const seleccionado = anio === anioSeleccionado;
                                            return (
                                                <TouchableOpacity
                                                    key={anio}
                                                    onPress={() => tieneDatos && seleccionarAnio(anio)}
                                                    activeOpacity={tieneDatos ? 0.7 : 1}
                                                    style={[
                                                        styles.anioBtn,
                                                        seleccionado && { backgroundColor: Universitario.rojo },
                                                        !tieneDatos && styles.anioBtnVacio,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.anioBtnText,
                                                            seleccionado && styles.anioBtnTextSeleccionado,
                                                            !tieneDatos && styles.anioBtnTextVacio,
                                                        ]}
                                                    >
                                                        {anio}
                                                    </Text>
                                                    {tieneDatos && !seleccionado && (
                                                        <View style={[styles.anioPunto, { backgroundColor: Universitario.rojo }]} />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </>
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

    selectorRow: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    selectorBtn: {
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectorBtnAnio: {
        fontSize: 22,
        fontFamily: Fonts.black,
        color: Universitario.crema,
    },
    selectorBtnLabel: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: Universitario.crema,
        opacity: 0.8,
    },

    listaPartidos: {
        paddingHorizontal: 14,
        paddingTop: 10,
        gap: 12,
    },
    resumenCard: {
        marginHorizontal: 14,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    resumenTotal: {
        fontSize: 46,
        lineHeight: 50,
        fontFamily: Fonts.black,
        textAlign: 'center',
    },
    resumenLabel: {
        fontSize: 15,
        fontFamily: Fonts.medium,
        textAlign: 'center',
        letterSpacing: 1,
        marginTop: 2,
        marginBottom: 12,
    },
    resultadosRow: {
        flexDirection: 'row',
        gap: 8,
    },
    resultadoBox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    resultadoGanados: {
        borderTopWidth: 2,
        borderTopColor: '#22c55e',
    },
    resultadoEmpatados: {
        borderTopWidth: 2,
        borderTopColor: '#f59e0b',
    },
    resultadoPerdidos: {
        borderTopWidth: 2,
        borderTopColor: '#ef4444',
    },
    resultadoGanadosNum: {
        fontSize: 35,
        lineHeight: 38,
        fontFamily: Fonts.black,
        color: '#16a34a',
    },
    resultadoEmpatadosNum: {
        fontSize: 35,
        lineHeight: 38,
        fontFamily: Fonts.black,
        color: '#f59e0b',
    },
    resultadoPerdidosNum: {
        fontSize: 35,
        lineHeight: 38,
        fontFamily: Fonts.black,
        color: '#f43f5e',
    },
    resultadoTxt: {
        fontSize: 12,
        fontFamily: Fonts.medium,
    },
    gfRow: {
        marginTop: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    gfCol: {
        alignItems: 'center',
        minWidth: 70,
    },
    gfNum: {
        fontSize: 33,
        lineHeight: 37,
        fontFamily: Fonts.black,
    },
    gfLabel: {
        fontSize: 12,
        fontFamily: Fonts.medium,
    },
    goleadorTopBox: {
        marginTop: 14,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    goleadorTopTitulo: {
        fontSize: 22,
        lineHeight: 26,
        fontFamily: Fonts.bold,
        color: '#ef4444',
    },
    goleadorTopNombre: {
        fontSize: 22,
        lineHeight: 26,
        fontFamily: Fonts.semiBold,
    },
    goleadorTopCantidad: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: Fonts.medium,
    },
    card: {
        borderRadius: 14,
        borderWidth: 1,
        paddingTop: 12,
        overflow: 'hidden',
    },
    cardMainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 10,
    },
    equipoCol: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    escudo: {
        width: 40,
        height: 48,
        borderRadius: 8,
        backgroundColor: Universitario.cremaOscuro,
        borderWidth: 1,
        borderColor: Universitario.dorado,
        alignItems: 'center',
        justifyContent: 'center',
    },
    escudoText: {
        fontSize: 12,
        fontFamily: Fonts.black,
        color: Universitario.rojoOscuro,
    },
    equipoNombre: {
        fontSize: 18,
        fontFamily: Fonts.medium,
        textAlign: 'center',
    },
    marcadorCol: {
        minWidth: 130,
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    marcador: {
        fontSize: 42,
        fontFamily: Fonts.black,
        lineHeight: 46,
    },
    competicion: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        color: Universitario.rojo,
        marginTop: 2,
    },
    fecha: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        marginTop: 1,
    },
    golesExtra: {
        borderTopWidth: 1,
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 12,
    },
    goleadoresRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    goleadoresColLocal: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 3,
    },
    goleadoresColVisitante: {
        flex: 1,
        alignItems: 'flex-end',
        gap: 3,
    },
    golesText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        lineHeight: 17,
    },

    estadoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 54,
        paddingHorizontal: 24,
        gap: 8,
    },
    estadoEmoji: {
        fontSize: 42,
    },
    estadoTitulo: {
        fontSize: 17,
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

    sinDatos: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
        gap: 10,
    },
    sinDatosIcono: {
        fontSize: 48,
    },
    sinDatosTitulo: {
        fontSize: 18,
        fontFamily: Fonts.bold,
    },
    sinDatosSubtitulo: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        lineHeight: 20,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitulo: {
        fontSize: 17,
        fontFamily: Fonts.bold,
    },
    modalCerrar: {
        fontSize: 15,
        fontFamily: Fonts.semiBold,
    },
    modalLista: {
        padding: 16,
        paddingBottom: 40,
    },
    decadaBloque: {
        marginBottom: 20,
    },
    decadaLabel: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    aniosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    anioBtn: {
        width: 54,
        height: 36,
        borderRadius: 8,
        backgroundColor: Universitario.grisClaro,
        alignItems: 'center',
        justifyContent: 'center',
    },
    anioBtnVacio: {
        opacity: 0.3,
    },
    anioBtnText: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: Universitario.negro,
    },
    anioBtnTextSeleccionado: {
        color: Universitario.crema,
    },
    anioBtnTextVacio: {
        color: Universitario.grisMedio,
    },
    anioPunto: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});
