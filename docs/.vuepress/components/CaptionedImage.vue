<template>
    <figure>
        <img :src="imagesrc" :alt="alt_text" />
        <figcaption style="text-align: center;">{{ caption }}</figcaption>
    </figure>
</template>
<script>
export default {
    props: ['src', 'caption', 'alt_text'],
    computed: {
        imagesrc() {
            return this.src
        }
    }
}
</script>
