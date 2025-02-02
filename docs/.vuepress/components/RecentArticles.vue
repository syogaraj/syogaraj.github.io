<template>
    <div>
        <ul>
            <li v-for="post in recentFiles">
                <a :href="post.path">{{ post.meta.t }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
import { useRoutes } from 'vuepress/client';



export default {
    data() {
        return {};
    },
    computed: {
        recentFiles() {
            let routes = useRoutes().value;
            let posts = []
            for (let route in routes) {
                if (route.indexOf("/blog/") < 0 || route == "/blog/") {
                    continue;
                }
                let routeDetail = routes[route]
                routeDetail.path = route;
                posts.push(routeDetail);
            }

            return posts.sort((a, b) => {
                let a_time = a.meta.d;
                let b_time = b.meta.d;
                let diff = a_time - b_time;
                if(diff < 0) return 1;
				if(diff > 0) return -1;
				return 0;
            }).slice(0, 5);
        }
    }
}
</script>