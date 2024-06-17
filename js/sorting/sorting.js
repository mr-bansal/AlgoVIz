let msSpeed = 180;
let li = [];
let stepCnt = 0;
let barWidth;
let algoDict = {
    1: 'Bubble Sort [O(n^2)]',
    2: 'Merge Sort [O(nlog(n))]',
    3: 'Insertion Sort [O(n^2)]',
    4: 'Quick Sort [O(nlog(n))]'
};
let generatorFunc;
let algoChoice;

document.addEventListener("DOMContentLoaded", () => {
    const sizeSlider = document.getElementById("size");
    const algoSelect = document.getElementById("algo");
    const speedSlider = document.getElementById("speed");

    sizeSlider.addEventListener('change', sizeChange);
    algoSelect.addEventListener('change', algoSelected);
    speedSlider.addEventListener('change', speedChange);

    resetArray();
});

function sizeChange() {
    const size = document.getElementById("size").value;
    resetArray(size);
}

function speedChange() {
    const speed = document.getElementById("speed").value;
    msSpeed = 180 / speed;
}

function resetArray(size = 30) {
    li = [];
    for (let i = 0; i < size; i++) {
        li.push(Math.floor(Math.random() * 100) + 1);
    }
    updateBars(li);
}

function algoSelected() {
    algoChoice = parseInt(document.getElementById("algo").value);
    const algoHeading = document.getElementById("maintext");
    algoHeading.textContent = algoDict[algoChoice];
}

function startSorting() {
    if (!algoChoice) {
        alert("Please select a sorting algorithm");
        return;
    }

    switch (algoChoice) {
        case 1:
            generatorFunc = bubbleSort(li);
            break;
        case 2:
            generatorFunc = mergeSort(li, 0, li.length - 1);
            break;
        case 3:
            generatorFunc = insertionSort(li);
            break;
        case 4:
            generatorFunc = quickSort(li, 0, li.length - 1);
            break;
        default:
            alert("Invalid algorithm selected!");
            return;
    }

    loop();
}

function loop() {
    function step() {
        const result = generatorFunc.next();
        if (!result.done) {
            updateBars(li);
            setTimeout(step, msSpeed);
        } else {
            updateBars(li);
        }
    }
    step();
}

function updateBars(array) {
    const container = document.getElementById("array-container");
    container.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.className = "column";
        bar.innerHTML = `
            <div class="bar" style="height: ${value * 3}px; width: ${100 / array.length}%;">
            </div>
        `;
        container.appendChild(bar);
    });
}

function* bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                stepCnt++;
                yield arr;
            }
        }
    }
    return arr;
}

function* insertionSort(arr) {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
            stepCnt++;
            yield arr;
        }
        arr[j + 1] = key;
        stepCnt++;
        yield arr;
    }
    return arr;
}

function* mergeSort(arr, l, r) {
    if (l >= r) return arr;
    const m = l + Math.floor((r - l) / 2);
    yield* mergeSort(arr, l, m);
    yield* mergeSort(arr, m + 1, r);
    yield* merge(arr, l, m, r);
    return arr;
}

function* merge(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = new Array(n1);
    const R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let i = 0; i < n2; i++) R[i] = arr[m + 1 + i];
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        stepCnt++;
        yield arr;
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        stepCnt++;
        yield arr;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        stepCnt++;
        yield arr;
    }
    return arr;
}

function* quickSort(arr, low, high) {
    if (low < high) {
        const pi = yield* partition(arr, low, high);
        yield* quickSort(arr, low, pi - 1);
        yield* quickSort(arr, pi + 1, high);
    }
    return arr;
}

function* partition(arr, low, high) {
    const pivot = arr[high];
    let i = (low - 1);
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            stepCnt++;
            yield arr;
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    stepCnt++;
    yield arr;
    return i + 1;
}
