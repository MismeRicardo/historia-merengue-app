import { Colors, Fonts, Universitario } from '@/constants/theme';
import goleadoresData from '@/data/goleadores.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function GoleadoresScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const ordenados = [...goleadoresData].sort((a, b) => b.goles - a.goles);
    const maximo = ordenados[0].goles;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Encabezado */}
            <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.headerEmoji}>⚽</Text>
                <Text style={styles.headerTitulo}>Goleadores Históricos</Text>
                <Text style={styles.headerSubtitulo}>Los máximos anotadores de la U</Text>
            </View>

            {/* Podio top 3 */}
            <View style={styles.podio}>
                {ordenados.slice(0, 3).map((g, i) => (
                    <View key={g.id} style={[styles.podioItem, i === 0 && styles.podioCenter]}>
                        <Text style={styles.podioMedalla}>{MEDALLAS[i]}</Text>
                        <View style={[
                            styles.podioCirculo,
                            { backgroundColor: i === 0 ? Universitario.dorado : Universitario.rojo, width: i === 0 ? 68 : 56, height: i === 0 ? 68 : 56, borderRadius: i === 0 ? 34 : 28 }
                        ]}>
                            <Text style={[styles.podioIniciales, { fontSize: i === 0 ? 22 : 18 }]}>
                                {g.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </Text>
                        </View>
                        <Text style={[styles.podioNombre, { color: colors.text }]} numberOfLines={2}>{g.nombre}</Text>
                        <Text style={[styles.podioGoles, { color: Universitario.rojo }]}>{g.goles} goles</Text>
                    </View>
                ))}
            </View>

            {/* Lista completa */}
            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Tabla Histórica</Text>
            {ordenados.map((g, i) => {
                const porcentaje = (g.goles / maximo) * 100;
                return (
                    <View key={g.id} style={[styles.card, { backgroundColor: Universitario.blanco }]}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.posicion, { backgroundColor: i < 3 ? Universitario.dorado : Universitario.cremaOscuro }]}>
                                <Text style={[styles.posicionText, { color: i < 3 ? Universitario.negro : colors.text }]}>
                                    {i + 1}
                                </Text>
                            </View>
                            <View style={styles.cardInfo}>
                                <View style={styles.nombreFila}>
                                    <Text style={[styles.nombre, { color: colors.text }]}>{g.nombre}</Text>
                                    {g.activo && (
                                        <View style={[styles.activoBadge, { backgroundColor: Universitario.rojo }]}>
                                            <Text style={styles.activoText}>ACTIVO</Text>
                                        </View>
                                    )}
                                </View>
                                {g.apodo && (
                                    <Text style={[styles.apodo, { color: Universitario.grisMedio }]}>{`"${g.apodo}"`}</Text>
                                )}
                                <Text style={[styles.temporadas, { color: colors.icon }]}>
                                    {g.temporadas} · {g.partidos} partidos · {g.nacionalidad}
                                </Text>
                            </View>
                            <Text style={[styles.golesNumero, { color: Universitario.rojo }]}>{g.goles}</Text>
                        </View>
                        {/* Barra de progreso */}
                        <View style={[styles.barraFondo, { backgroundColor: Universitario.cremaOscuro }]}>
                            <View style={[styles.barraRelleno, { width: `${porcentaje}%` as any, backgroundColor: i < 3 ? Universitario.dorado : Universitario.rojo }]} />
                        </View>
                    </View>
                );
            })}
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
    headerEmoji: { fontSize: 48, marginBottom: 8 },
    headerTitulo: {
        fontSize: 26,
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
    podio: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 16,
    },
    podioItem: {
        alignItems: 'center',
        flex: 1,
        gap: 6,
    },
    podioCenter: {
        marginBottom: 12,
    },
    podioMedalla: { fontSize: 24 },
    podioCirculo: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    podioIniciales: {
        fontFamily: Fonts.black,
        color: Universitario.blanco,
    },
    podioNombre: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        textAlign: 'center',
    },
    podioGoles: {
        fontSize: 13,
        fontFamily: Fonts.semiBold,
    },
    seccionTitulo: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 14,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    posicion: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    posicionText: {
        fontSize: 14,
        fontFamily: Fonts.black,
    },
    cardInfo: { flex: 1 },
    nombreFila: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    nombre: {
        fontSize: 15,
        fontFamily: Fonts.bold,
    },
    activoBadge: {
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    activoText: {
        fontSize: 9,
        fontFamily: Fonts.black,
        color: Universitario.blanco,
        letterSpacing: 0.5,
    },
    apodo: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        marginBottom: 2,
    },
    temporadas: {
        fontSize: 11,
        fontFamily: Fonts.regular,
    },
    golesNumero: {
        fontSize: 24,
        fontFamily: Fonts.black,
    },
    barraFondo: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    barraRelleno: {
        height: 6,
        borderRadius: 3,
    },
});
