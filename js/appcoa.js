const { createApp,ref,defineAsyncComponent, onMounted } = Vue;
const { createRouter, createWebHistory } = VueRouter;

// Simulación de un sistema de autenticación simple
const isAuthenticated = ref(false);





// Componentes
/*const Home = { template: '<h2>Inicio</h2><p>Bienvenido a la página de inicio.</p>' };
const About = { template: '<h2>Acerca de</h2><p>Esta es la página de Acerca de.</p>' };
const Contact = { template: '<h2>Contacto</h2><p>Esta es la página de Contacto.</p>' };
const Login = { template: `
        <div>
            <h2>Login</h2>
            <p>Por favor, ingresa tus credenciales.</p>
            <button @click="login">Iniciar Sesión</button>
        </div>
    `,
    setup() {
        const login = () => {
            isAuthenticated.value = true;
            router.push('/');
        };

        return { login };
    }
}*/


// Función para cargar contenido HTML externo como string
function loadTemplate(url) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            return {
                template: `<div>${html}</div>`
            };
        });
}

// Componentes cargados asincrónicamente
const Home = defineAsyncComponent(() => loadTemplate('rutas/home.html'));
const About = defineAsyncComponent(() => loadTemplate('rutas/about.html'));
const Contact = defineAsyncComponent(() => loadTemplate('rutas/contact.html'));

// Componente Login con manejo de evento
const Login = defineAsyncComponent(() => loadTemplate('rutas/login.html').then(component => {
    return {
        ...component,
        setup() {
            onMounted(() => {
                document.getElementById('login-button').addEventListener('click', () => {
                    isAuthenticated.value = true;
                    router.push('/');
                });
            });
        }
    };
}));



// Definir rutas
  // Definir rutas
  const routes = [
    { path: '/', component: Home , meta:{requiresAuth:true}},
    { path: '/about', component: About, meta: { requiresAuth: true } },
    { path: '/contact', component: Contact, meta: { requiresAuth: true } },
    { path: '/login', component: Login }
];








// Crear router
const router = createRouter({
    history: createWebHistory(),
    routes
});

  // Guardia de navegación para proteger rutas
/*  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        next('/login');
    } else {
        next();
    }
});*/

   // Guardia de navegación para proteger rutas y redirigir al inicio al recargar
   router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        next('/login');
    } else if (!isAuthenticated.value && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
});


// Crear aplicación Vue
const app = createApp({});
app.use(router);
app.mount('#app')