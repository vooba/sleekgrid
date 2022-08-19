import { defaultColumnFormat, applyFormatterResultToCellNode } from "@/core/formatting";
import { htmlEncode } from "@/core/util";

describe('defaultFormatter', () => {
    it('should encode & as &amp;', () => {
        expect(defaultColumnFormat({ value: '&' })).toBe('&amp;');
    });

    it('should encode < as &lt;', () => {
        expect(defaultColumnFormat({ value: '<' })).toBe('&lt;');
    });

    it('should encode > as &gt;', () => {
        expect(defaultColumnFormat({ value: '>' })).toBe('&gt;');
    });

    it('should encode multiple & as &amp;', () => {
        expect(defaultColumnFormat({ value: '&&' })).toBe('&amp;&amp;');
    });

    it('should encode multiple < as &lt;', () => {
        expect(defaultColumnFormat({ value: '<<' })).toBe('&lt;&lt;');
    });

    it('should encode multiple > as &gt;', () => {
        expect(defaultColumnFormat({ value: '>>' })).toBe('&gt;&gt;');
    });

    it('should encode all characters', () => {
        expect(defaultColumnFormat({ value: '&<>' })).toBe('&amp;&lt;&gt;');
    });

    it('should return empty string if parameter is null or undefined', () => {
        expect(defaultColumnFormat({ value: null })).toBe('');
        expect(defaultColumnFormat({ value: undefined })).toBe('');
    });

    it('should convert any type to a string', () => {
        expect(defaultColumnFormat({ value: 1 })).toBe('1');
        expect(defaultColumnFormat({ value: true })).toBe('true');
        expect(defaultColumnFormat({ value: {} })).toBe('[object Object]');
    });
});

describe('applyFormatterResultToCellNode', () => {
    it('should remove old fmatt from element dataset', () => {
        const cellNode = document.createElement('div');
        cellNode.dataset.fmtatt = 'a,b,c';

        expect(cellNode.dataset.fmtatt).not.toBe(undefined);

        applyFormatterResultToCellNode({}, '', cellNode);

        expect(cellNode.dataset.fmtatt).toBe(undefined);
    });

    it('should remove old fmatt values from element attributes', () => {
        const cellNode = document.createElement('div');
        cellNode.dataset.fmtatt = 'a,b,c';
        cellNode.setAttribute('a', '1');
        cellNode.setAttribute('b', '2');
        cellNode.setAttribute('c', '3');

        applyFormatterResultToCellNode({}, '', cellNode);

        expect(cellNode.dataset.fmtatt).toBe(undefined);
        expect(cellNode.getAttribute('a')).toBe(null);
        expect(cellNode.getAttribute('b')).toBe(null);
        expect(cellNode.getAttribute('c')).toBe(null);
    });

    it('should remove old fmtcls from element dataset', () => {
        const cellNode = document.createElement('div');
        cellNode.dataset.fmtcls = 'a,b,c';

        expect(cellNode.dataset.fmtcls).not.toBe(undefined);

        applyFormatterResultToCellNode({}, '', cellNode);

        expect(cellNode.dataset.fmtcls).toBe(undefined);
    });

    it('should remove old fmtcls values from element classes if result contains addClass', () => {
        const cellNode = document.createElement('div');
        cellNode.dataset.fmtcls = 'a b c';
        cellNode.classList.add('a', 'b', 'c');

        applyFormatterResultToCellNode({}, '', cellNode);

        expect(cellNode.dataset.fmtcls).toBe(undefined);
        expect(cellNode.classList.contains('a')).toBe(false);
        expect(cellNode.classList.contains('b')).toBe(false);
        expect(cellNode.classList.contains('c')).toBe(false);
    });

    it('should remove tooltip from element if result doesnt contain tooltip', () => {
        const cellNode = document.createElement('div');
        cellNode.setAttribute('tooltip', 'a');

        applyFormatterResultToCellNode({}, '', cellNode);

        expect(cellNode.getAttribute('tooltip')).toBe(null);
    });

    it('should set tooltip on element if result contains tooltip', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({
            tooltip: 'test'
        }, undefined, cellNode);

        expect(cellNode.getAttribute('tooltip')).toBe('test');
    });

    it('should set html of the element if fmtResult is string', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({}, 'test', cellNode);

        expect(cellNode.innerHTML).toBe('test');
    });

    it('should set html of the element to the html in the object', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({}, 'test<span>test</span>', cellNode);

        expect(cellNode.childElementCount).toBe(1);
        expect(cellNode.innerHTML).toBe('test<span>test</span>');
    });

    it('should apply attributes using addAttrs in the object', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({
            addAttrs: {
                a: '1',
                b: '2',
                c: '3'
            }
        }, undefined, cellNode);

        expect(cellNode.getAttribute('a')).toBe('1');
        expect(cellNode.getAttribute('b')).toBe('2');
        expect(cellNode.getAttribute('c')).toBe('3');
    });

    it('should set fmtatt in the dataset using addAttrs in the object', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({
            addAttrs: {
                a: '1',
                b: '2',
                c: '3'
            }
        }, undefined, cellNode);

        expect(cellNode.dataset.fmtatt).toBe('a,b,c');
    });

    it('should apply tooltip', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({
            tooltip: 'test'
        }, undefined, cellNode);

        expect(cellNode.getAttribute('tooltip')).toBe('test');
    });

    it('should empty innerHTML if object is null or undefined', () => {
        const cellNode = document.createElement('div');
        cellNode.innerHTML = 'test';

        applyFormatterResultToCellNode({}, null, cellNode);
        expect(cellNode.innerHTML).toBe('');

        cellNode.innerHTML = 'test';
        applyFormatterResultToCellNode({}, undefined, cellNode);
        expect(cellNode.innerHTML).toBe('');
    });

    it('should apply classes using addClass in the object', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({
            addClass: 'a b c'
        }, undefined, cellNode);

        expect(cellNode.classList.contains('a')).toBe(true);
        expect(cellNode.classList.contains('b')).toBe(true);
        expect(cellNode.classList.contains('c')).toBe(true);
    });

    it('should set fmtcls in the dataset using addClass in the object', () => {
        const cellNode = document.createElement('div');

        applyFormatterResultToCellNode({
            addClass: 'a b c'
        }, undefined, cellNode);

        expect(cellNode.dataset.fmtcls).toBe('a b c');
    });
});