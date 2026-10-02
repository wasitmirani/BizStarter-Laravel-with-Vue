
<script setup lang="ts">
const props = defineProps(['errors', 'value'])
const getMessage = (value:string)=>{
        if(value){
            return value[0];
        }
    }
</script>
<template>
    <div v-if="errors && errors[value]">
       
        {{ getMessage(errors[value]) }}
    </div>
     
</template>
