export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }


    // toggle class
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // set text content
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // change block status
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // hide block
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // show block
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // set image with alt text
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // return DOM component
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
