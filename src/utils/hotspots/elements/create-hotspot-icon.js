import { hidePopup } from '../attach-events/hide-popup';
import { showPopup } from '../attach-events/show-popup';
import { hideHotspotIcon } from '../hide-hotspot-icon';

export const createHotspotIcon = (container, hotspotConfig, popup, popperInstance) => {
  const { indicatorSelector, variant } = hotspotConfig;
  const { url, anchorId } = variant;
  const { popupProps: { open = false } } = hotspotConfig;

  let isVisible;
  let timeoutID;
  const hotspotIcon = document.createElement('div');

  hotspotIcon.style.position = 'absolute';

  hotspotIcon.className = `cloudimage-360-hotspot-${url ? 'link' : 'custom'}-icon ${indicatorSelector}`;

  hotspotIcon.setAttribute('data-hotspot-icon-id', anchorId);
  hotspotIcon.setAttribute('data-cloudimage-360-hotspot', '');

  const popupMouseEnter = () => {
    isVisible = true;
  };

  const popupMouseLeave = () => {
    isVisible = false;

    !open && hidePopup(popup, isVisible);
  }

  hotspotIcon.onclick = (e) => e.stopPropagation();

  const showEvents = ['mouseenter', 'touchstart', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  showEvents.forEach((event) => {
    hotspotIcon.addEventListener(event, () => {clearTimeout(timeoutID); return showPopup(popup, popperInstance);});
  });

  if (!open) {
    hideEvents.forEach((event) => {
      hotspotIcon.addEventListener(
        event,
        () => timeoutID = setTimeout(() => hidePopup(popup, isVisible), 500)
      );
    });
  }

  popup.addEventListener('mouseenter', popupMouseEnter);
  popup.addEventListener('mouseleave', popupMouseLeave);

  hideHotspotIcon(hotspotIcon);

  container.appendChild(hotspotIcon);

  return hotspotIcon;
};
