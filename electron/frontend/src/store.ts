import { reactive  } from 'vue';

const store = reactive({
    cadetProfileReturn: ''
});

function setcadetProfileReturn(value: '') {
    store.cadetProfileReturn = value;
}

export { store, setcadetProfileReturn };