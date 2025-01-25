<template>
    <div>
        <ul>
            <li v-for="post in recentFiles">
                <a :href="post.path">{{ post.title }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
import { useRoutes, resolveRoute, useSiteData, useClientData, resolveRoutePath } from 'vuepress/client';



export default {
    data() {
        return {};
    },
    computed: {
        recentFiles() {
            let routes = useRoutes().value;
            let posts = []
            for (let route in routes) {
                if (route.indexOf("/blog/") < 0) {
                    continue;
                }
                let routeDetail = routes[route]
                posts.push({path: route, title: routeDetail.meta.title })
            }
            return posts;
        }
    }
}
</script>