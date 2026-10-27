(() => {
    const controls = document.querySelector('[data-article-browser]');
    const results = document.getElementById('article-results');
    if (!controls || !results) return;

    const cards = Array.from(results.querySelectorAll('.article-card'));
    const search = document.getElementById('article-search');
    const sort = document.getElementById('article-sort');
    const count = document.getElementById('article-result-count');
    const empty = document.getElementById('article-empty');
    const reset = controls.querySelector('[data-article-reset]');
    const buttons = Array.from(controls.querySelectorAll('[data-topic]'));
    const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const entries = cards.map((card, index) => ({
        card, index,
        topics: card.dataset.topics.split(' '),
        title: card.querySelector('h3').textContent,
        text: normalize(card.querySelector('h3').textContent + ' ' + card.querySelector('p').textContent + ' ' + card.querySelector('.article-card-topics').textContent),
        updated: card.dataset.updated
    }));
    let topic = 'all';

    const update = () => {
        const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
        const matchesSearch = entry => words.every(word => entry.text.includes(word));
        const ordered = [...entries].sort((a, b) => {
            if (sort.value === 'title') return a.title.localeCompare(b.title, 'en') || a.index - b.index;
            if (sort.value === 'updated') return b.updated.localeCompare(a.updated) || a.index - b.index;
            return a.index - b.index;
        });
        let visible = 0;
        ordered.forEach(entry => {
            entry.card.hidden = !matchesSearch(entry) || (topic !== 'all' && !entry.topics.includes(topic));
            if (!entry.card.hidden) visible++;
            results.append(entry.card);
        });
        buttons.forEach(button => {
            const key = button.dataset.topic;
            button.setAttribute('aria-pressed', String(key === topic));
            button.querySelector('[data-topic-count]').textContent = entries.filter(entry => matchesSearch(entry) && (key === 'all' || entry.topics.includes(key))).length;
        });
        count.textContent = visible === entries.length ? `Showing all ${visible} articles` : `Showing ${visible} of ${entries.length} articles`;
        empty.hidden = visible !== 0;
        reset.hidden = topic === 'all' && !search.value && sort.value === 'recommended';
    };

    buttons.forEach(button => button.addEventListener('click', () => {
        topic = button.dataset.topic;
        update();
    }));
    search.addEventListener('input', update);
    sort.addEventListener('change', update);
    reset.addEventListener('click', () => {
        topic = 'all';
        search.value = '';
        sort.value = 'recommended';
        update();
        search.focus();
    });
    update();
    controls.hidden = false;
})();
