//@ts-check

const dom_conferences = document.querySelector('#conferences');
const dom_nextConferences = document.querySelector('#next-conferences');
const dom_btn_moreconferences = document.querySelector('#more-conferences');
const dom_videos = document.querySelector('#videos');

dom_btn_moreconferences.addEventListener('click', event => {
    console.log("View more conferences");
    document.querySelector('.conferences__overlay').remove();
    dom_btn_moreconferences.remove();
    dom_conferences.classList.remove("conferences--small");
});


class Conference {

    /**
     * @param {any} conference
     * @param {boolean} past
     */
    constructor(conference, past) {
        this.conference = conference;
        this.past = past;
    }

    /**
     * @param {any} past
     */
    isPast(past) {
        if (!past) {
            return `<span class='soon'>Soon!</span>`
        }
        return '';
    }

    getTalk() {
        if (!this.conference.talk) return "";

        return `<span> • ${this.conference.talk.title}</span>`;
    }

    getRoles() {
        if (!this.conference.roles || this.conference.roles.length === 0) return "";

        let tpl = '';
        for (let role of this.conference.roles) {
            tpl += `<li class="role ${role}">[${role}]</li>`;
        }
        return tpl;
    }

    getVideo() {
        if (!this.conference.talk || !this.conference.talk.video) return "";
        return `
      <a target="_blank" title="See video" href="${this.conference.talk.video}">
        <i class="fas fa-video"></i>
      </a>`;
    }

    toHtml() {
        const tmpl = `
            <li class="conference">
              <div class="d-flex flex-row">
                <div>
                  ${this.isPast(this.past)}
                  <ul class="roles">
                    <li class="role speaker">${this.getRoles()}</li>
                  </ul>
                  <a href="${this.conference.link}" class="host" target="_blank">${this.conference.name}</a>
                  ${this.getTalk()}
                </div>
                <div class="flex-1"></div>
                ${this.getVideo()}
              </div>
              <div class="infos">
                <span class="location">${this.conference.location.name}</span>
                  • 
                <span class="date">${this.conference.date}</span>
              </div>
            </li>
          `;
        const range = document.createRange();
        const fragment = range.createContextualFragment(tmpl);

        return fragment;
    }
}

class Conferences {
    constructor() {
        /** @type {Conference[]} */
        this.conferences = [];
    }

    async get() {
        const raw_data = await fetch('assets/data/conferences.json');
        const data = await raw_data.json();

        if (data) {
            const currentDate = new Date().getTime();

            for (let conference of data) {
                const d = new Date(conference.date).getTime();
                const past = d < currentDate;
                this.conferences.push(new Conference(conference, past));
            }
        }
    }

    print() {
        for (let conference of this.conferences) {
            dom_conferences.insertBefore(conference.toHtml(), dom_conferences.lastChild);
        }
    }
}


(async function() { // async function expression used as an IIFE
    const conferences = new Conferences();
    await conferences.get();
    conferences.print();
})();