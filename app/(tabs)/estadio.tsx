import { Colors, Fonts, Universitario } from '@/constants/theme';
import estadioData from '@/data/estadio.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EstadioScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Encabezado */}
            <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.headerEmoji}>🏟️</Text>
                <Text style={styles.headerNombre}>{estadioData.nombre}</Text>
                <Text style={styles.headerApodo}>{estadioData.apodo}</Text>
                <View style={[styles.capBadge, { backgroundColor: Universitario.rojo }]}>
                    <Text style={styles.capNumero}>{estadioData.capacidad.toLocaleString()}</Text>
                    <Text style={styles.capLabel}>espectadores</Text>
                </View>
            </View>

            {/* Datos básicos */}
            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Información General</Text>
            <View style={[styles.infoCard, { backgroundColor: Universitario.blanco }]}>
                <InfoFila label="Nombre completo" valor={estadioData.nombreCompleto} colors={colors} />
                <InfoFila label="Inauguración" valor={new Date(estadioData.inauguracion).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })} colors={colors} />
                <InfoFila label="Ubicación" valor={`${estadioData.ubicacion.distrito}, ${estadioData.ubicacion.ciudad}`} colors={colors} />
                <InfoFila label="Dimensiones" valor={`${estadioData.dimensiones.largo} × ${estadioData.dimensiones.ancho} ${estadioData.dimensiones.unidad}`} colors={colors} />
                <InfoFila label="Capacidad" valor={estadioData.capacidad.toLocaleString()} colors={colors} ultimo />
            </View>

            {/* Récord de asistencia */}
            <View style={[styles.recordCard, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.recordLabel}>📊 Récord de Asistencia</Text>
                <Text style={styles.recordNumero}>{estadioData.record_asistencia.cantidad.toLocaleString()}</Text>
                <Text style={styles.recordPartido}>{estadioData.record_asistencia.partido}</Text>
                <Text style={styles.recordFecha}>{new Date(estadioData.record_asistencia.fecha).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </View>

            {/* Características */}
            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Características</Text>
            <View style={[styles.caracteristicasCard, { backgroundColor: Universitario.blanco }]}>
                {estadioData.caracteristicas.map((c, i) => (
                    <View key={i} style={[styles.caracteristicaFila, i > 0 && { borderTopColor: Universitario.cremaOscuro, borderTopWidth: 1 }]}>
                        <Text style={[styles.checkIcon, { color: Universitario.rojo }]}>✓</Text>
                        <Text style={[styles.caracteristicaText, { color: colors.text }]}>{c}</Text>
                    </View>
                ))}
            </View>

            {/* Eventos históricos */}
            <Text style={[styles.seccionTitulo, { color: colors.text }]}>Eventos Históricos</Text>
            {estadioData.eventosHistoricos.map((ev, i) => (
                <View key={i} style={[styles.eventoCard, { backgroundColor: Universitario.blanco, borderLeftColor: Universitario.rojo }]}>
                    <View style={[styles.eventoAnio, { backgroundColor: Universitario.rojo }]}>
                        <Text style={styles.eventoAnioText}>{ev.anio}</Text>
                    </View>
                    <View style={styles.eventoInfo}>
                        <Text style={[styles.eventoTitulo, { color: colors.text }]}>{ev.evento}</Text>
                        <Text style={[styles.eventoDesc, { color: colors.icon }]}>{ev.descripcion}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

function InfoFila({ label, valor, colors, ultimo }: { label: string; valor: string; colors: any; ultimo?: boolean }) {
    return (
        <View style={[styles.infoFila, !ultimo && { borderBottomColor: Universitario.cremaOscuro, borderBottomWidth: 1 }]}>
            <Text style={[styles.infoLabel, { color: colors.icon }]}>{label}</Text>
            <Text style={[styles.infoValor, { color: colors.text }]}>{valor}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: 40 },
    header: {
        paddingTop: 56,
        paddingBottom: 32,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerEmoji: { fontSize: 56, marginBottom: 12 },
    headerNombre: {
        fontSize: 22,
        fontFamily: Fonts.black,
        color: Universitario.crema,
        textAlign: 'center',
        marginBottom: 4,
    },
    headerApodo: {
        fontSize: 13,
        fontFamily: Fonts.medium,
        color: Universitario.grisMedio,
        textAlign: 'center',
        marginBottom: 16,
    },
    capBadge: {
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
    },
    capNumero: {
        fontSize: 28,
        fontWeight: '900',
        color: Universitario.crema,
    },
    capLabel: {
        fontSize: 12,
        color: Universitario.cremaOscuro,
    },
    seccionTitulo: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    infoCard: {
        marginHorizontal: 16,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    infoFila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    infoLabel: { fontSize: 13, fontFamily: Fonts.regular, flex: 1 },
    infoValor: { fontSize: 14, fontFamily: Fonts.semiBold, flex: 1.5, textAlign: 'right' },
    recordCard: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 14,
        padding: 20,
        alignItems: 'center',
    },
    recordLabel: { fontSize: 13, color: Universitario.cremaOscuro, marginBottom: 8 },
    recordNumero: {
        fontSize: 40,
        fontFamily: Fonts.black,
        color: Universitario.crema,
        marginBottom: 4,
    },
    recordPartido: { fontSize: 14, fontFamily: Fonts.semiBold, color: Universitario.crema, marginBottom: 4 },
    recordFecha: { fontSize: 12, fontFamily: Fonts.regular, color: Universitario.cremaOscuro },
    caracteristicasCard: {
        marginHorizontal: 16,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    caracteristicaFila: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    checkIcon: { fontSize: 16, fontWeight: '700' },
    caracteristicaText: { fontSize: 14 },
    eventoCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: 16,
        borderLeftWidth: 4,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    eventoAnio: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    eventoAnioText: { fontSize: 13, fontFamily: Fonts.bold, color: Universitario.crema },
    eventoInfo: { flex: 1 },
    eventoTitulo: { fontSize: 15, fontFamily: Fonts.bold, marginBottom: 4 },
    eventoDesc: { fontSize: 13, fontFamily: Fonts.regular, lineHeight: 18 },
});
