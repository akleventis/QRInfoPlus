import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        color: '#ffff',
        backgroundColor: '#2b3d4b',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingTop: 5,
        paddingBottom: 5
    },
    scroll_container: {
        flex: 1,
        backgroundColor: '#2b3d4b',
    },
    button: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ee6124',
        width: 250,
        margin: 10,
        backgroundColor: '#172e41',
      },  

    // home/index.tsx 
    auth_container: {
        margin: 75,
    },
    auth_text:{
        textAlign: 'center',
        fontFamily: 'Optima',
        fontSize: 25,
        color: '#ffff',
    },

    // info/info.tsx
    info_c: {
        backgroundColor: '#172e41',
        maxWidth: 300,
        borderRadius: 10,
        padding: 10,
        marginBottom: 25,
        marginTop: 5,
        display: 'flex',
        alignItems: 'center',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'black',
        shadowOpacity: 2.0,
    },
    info_title:{
        fontFamily: 'Optima',
        color: '#ffff',
        fontSize: 20,
        textAlign: 'center',
    },
    info_data: {
        fontFamily: 'American Typewriter',
        color: '#ffff',
        textAlign: 'center',
        fontSize: 15,
    },
    link_c: {
        backgroundColor: '#234663',
    },
    link: {
        fontFamily: 'American Typewriter',
        color: '#ffff',
        fontSize: 15,
    },
    bitly_logo: {
        width: 30, 
        height: 30, 
        marginTop: 10,
        marginBottom: 10
    }
})