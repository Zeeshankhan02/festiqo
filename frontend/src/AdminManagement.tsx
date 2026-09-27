import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Eye,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import {
  events,
  registrations,
  sampleCertificateTemplate,
  sampleUser,
} from "./mockData";
import { useAuth } from "./AuthContext";
import type {
  Certificate,
  CertificateTemplate,
  Registration,
  Volunteer,
} from "./types";

type Toast = (message: string) => void;
function AdminPageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="head-action">{action}</div>}
    </div>
  );
}
function AdminDialog({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <section
        className="modal admin-dialog bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-head">
          <h2>{title}</h2>
          <button
            className="icon-button"
            type="button"
            aria-label="Close dialog"
            onClick={close}
          >
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="empty-state">
      <span>
        <Users size={21} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export function VolunteersPage({ toast }: { toast: Toast }) {
  const { volunteers, createVolunteer, setVolunteerStatus } = useAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [created, setCreated] = useState<{
    volunteer: Volunteer;
    password: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<Volunteer | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, []);
  const filtered = volunteers.filter(
    (volunteer) =>
      volunteer.email.includes(query.trim().toLowerCase()) &&
      (statusFilter === "all" || volunteer.status === statusFilter)
  );
  const reset = () => {
    setCreateOpen(false);
    setEmail("");
    setFormError("");
    setCreated(null);
  };
  const submit = () => {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setFormError("Enter a valid volunteer email address.");
      return;
    }
    setBusy(true);
    setFormError("");
    window.setTimeout(() => {
      try {
        setCreated(createVolunteer(normalized));
        toast("Volunteer account created");
      } catch (cause) {
        setFormError(
          cause instanceof Error
            ? cause.message
            : "Could not create volunteer account."
        );
      } finally {
        setBusy(false);
      }
    }, 300);
  };
  const copyPassword = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.password);
      toast("Generated password copied");
    } catch {
      setFormError(
        "Clipboard access is unavailable. Select and copy the password."
      );
    }
  };
  return (
    <>
      <AdminPageTitle
        eyebrow="THE PEOPLE WHO MAKE IT HAPPEN"
        title="Volunteer management"
        description="Create volunteer access and manage the people on the ground."
        action={
          <button className="btn btn-dark" onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Create volunteer
          </button>
        }
      />
      <div className="volunteer-stats">
        <div className="stat-card">
          <span className="stat-label">Total volunteers</span>
          <b className="stat-value">{volunteers.length}</b>
          <small>Across all fest shifts</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active</span>
          <b className="stat-value">
            {volunteers.filter((item) => item.status === "active").length}
          </b>
          <small>Can sign in to the volunteer workspace</small>
        </div>
      </div>
      <div className="admin-list dark:bg-zinc-900 dark:border-zinc-800">
        <div className="volunteer-toolbar">
          <div className="inline-search dark:bg-zinc-800 dark:border-zinc-700">
            <Search size={16} />
            <input
              aria-label="Search volunteer emails"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search volunteer email"
            />
          </div>
          <label className="volunteer-filter">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
        <div className="volunteer-table">
          <div className="volunteer-row volunteer-head">
            <span>EMAIL</span>
            <span>STATUS</span>
            <span>CREATED AT</span>
            <span>ACTIONS</span>
          </div>
          {loading ? (
            <div className="volunteer-loading">
              <i />
              <i />
              <i />
            </div>
          ) : loadError ? (
            <div className="empty-state">
              <h3>Volunteers didn’t load</h3>
              <p>Try loading the list again.</p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setLoadError(false);
                  setLoading(true);
                  window.setTimeout(() => setLoading(false), 250);
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            filtered.map((volunteer) => (
              <div className="volunteer-row" key={volunteer.id}>
                <b className="volunteer-email">{volunteer.email}</b>
                <span className={`volunteer-status ${volunteer.status}`}>
                  <i />
                  {volunteer.status}
                </span>
                <span>
                  {new Date(volunteer.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="volunteer-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => setView(volunteer)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      setVolunteerStatus(
                        volunteer.id,
                        volunteer.status === "active" ? "inactive" : "active"
                      )
                    }
                  >
                    {volunteer.status === "active"
                      ? "Deactivate"
                      : "Reactivate"}
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
        {!loading && !loadError && !filtered.length && (
          <EmptyState
            title="No volunteers found"
            message={
              query
                ? "Try another email or clear the status filter."
                : "Create a volunteer account to get started."
            }
          />
        )}
      </div>
      {createOpen && (
        <AdminDialog
          title={created ? "Volunteer account created" : "Create volunteer"}
          close={reset}
        >
          {created ? (
            <div className="credential-success">
              <span className="auth-success-mark">
                <Check size={22} />
              </span>
              <p>
                <b>{created.volunteer.email}</b> can now sign in to the
                volunteer workspace.
              </p>
              <label className="auth-field">
                Generated password
                <span className="generated-secret">
                  <input readOnly value={created.password} />
                  <button
                    type="button"
                    onClick={copyPassword}
                    aria-label="Copy generated password"
                  >
                    <Copy size={17} />
                  </button>
                </span>
              </label>
              <small>
                Copy this now. It won’t be shown again after you close this
                dialog.
              </small>
              <div className="modal-actions">
                <button className="btn btn-dark" onClick={reset}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <label className="auth-field">
                Volunteer email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="volunteer@college.edu"
                  autoComplete="email"
                />
              </label>
              <p className="form-note">
                <ShieldCheck size={15} /> We’ll create a unique random password
                and show it once.
              </p>
              {formError && (
                <p className="auth-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={reset}>
                  Cancel
                </button>
                <button
                  className="btn btn-dark"
                  disabled={busy}
                  onClick={submit}
                >
                  {busy ? "Creating…" : "Create volunteer"}
                </button>
              </div>
            </>
          )}
        </AdminDialog>
      )}
      {view && (
        <AdminDialog title="Volunteer account" close={() => setView(null)}>
          <dl className="volunteer-details">
            <dt>Email</dt>
            <dd>{view.email}</dd>
            <dt>Status</dt>
            <dd>{view.status}</dd>
            <dt>Created</dt>
            <dd>{new Date(view.createdAt).toLocaleString()}</dd>
          </dl>
          <p className="form-note">
            For security, existing passwords can’t be viewed.
          </p>
        </AdminDialog>
      )}
    </>
  );
}

export function certificateRecipient(
  registration: Registration,
  participantName: string
) {
  const teamName = registration.teamName?.trim();
  return teamName || participantName;
}

export function ParticipationCertificate({
  recipientName,
  eventName,
  title,
  description,
  signatureName,
  signatureRole,
}: {
  recipientName: string;
  eventName: string;
  title: string;
  description: string;
  signatureName: string;
  signatureRole: string;
}) {
  return (
    <article className="participation-certificate bg-white text-zinc-900 border-zinc-300">
      <div className="certificate-inner">
        <span className="certificate-mark">Y</span>
        <small>YUKTI · NORTH CAMPUS FEST 2026</small>
        <h2>{title || "Certificate of Participation"}</h2>
        <span className="certificate-rule" />
        <p>This certificate is proudly presented to</p>
        <strong>{recipientName || "Participant Name"}</strong>
        <p>
          {description || "for bringing your ideas and energy to the fest."}
        </p>
        <span className="certificate-event">{eventName}</span>
        <div className="certificate-signature">
          <b>{signatureName || "Fest Coordinator"}</b>
          <span>{signatureRole || "Fest Coordinator"}</span>
        </div>
      </div>
    </article>
  );
}

type CertificateDraft = Omit<
  CertificateTemplate,
  "id" | "status" | "createdAt" | "recipientCount"
>;
const blankDraft: CertificateDraft = {
  title: "Certificate of Participation",
  description: "for bringing your ideas and energy to the fest.",
  eventId: events[0]?.id || "",
  signatureName: "",
  signatureRole: "Fest Coordinator",
};
export function CertificatesPage({ toast }: { toast: Toast }) {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([
    sampleCertificateTemplate,
  ]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [draft, setDraft] = useState<CertificateDraft>({
    title: sampleCertificateTemplate.title,
    description: sampleCertificateTemplate.description,
    eventId: sampleCertificateTemplate.eventId,
    signatureName: sampleCertificateTemplate.signatureName,
    signatureRole: sampleCertificateTemplate.signatureRole,
  });
  const [editingId, setEditingId] = useState<string | null>(
    sampleCertificateTemplate.id
  );
  const [registrationId, setRegistrationId] = useState(
    registrations[0]?.id || ""
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [previewPublished, setPreviewPublished] = useState(false);
  const [publishConfirm, setPublishConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 160);
    return () => window.clearTimeout(timer);
  }, []);
  const event = events.find((item) => item.id === draft.eventId);
  const eligible = registrations.filter(
    (item) => item.eventId === draft.eventId && item.status === "confirmed"
  );
  const selectedRegistration =
    eligible.find((item) => item.id === registrationId) || eligible[0];
  const validate = () => {
    const next: string[] = [];
    if (!draft.title.trim()) next.push("Add a certificate title.");
    if (!draft.description.trim()) next.push("Add a certificate description.");
    if (!draft.eventId) next.push("Choose an event.");
    if (!draft.signatureName.trim()) next.push("Add a signature name.");
    if (!draft.signatureRole.trim()) next.push("Add a signature role.");
    if (!eligible.length)
      next.push("There are no confirmed registrations for this event yet.");
    setErrors(next);
    return next.length === 0;
  };
  const saveDraft = () => {
    if (!draft.title.trim()) {
      setErrors(["Add a certificate title before saving."]);
      return;
    }
    const existing = templates.find((item) => item.id === editingId);
    const next: CertificateTemplate = {
      id: editingId || crypto.randomUUID(),
      ...draft,
      status: existing?.status || "draft",
      createdAt: existing?.createdAt || new Date().toISOString(),
      recipientCount: existing?.recipientCount || 0,
    };
    setTemplates((current) =>
      existing
        ? current.map((item) => (item.id === next.id ? next : item))
        : [next, ...current]
    );
    setEditingId(next.id);
    toast("Certificate draft saved");
    setErrors([]);
  };
  const newDraft = () => {
    setDraft({ ...blankDraft });
    setEditingId(null);
    setErrors([]);
    setRegistrationId(registrations[0]?.id || "");
  };
  const edit = (template: CertificateTemplate) => {
    setDraft({
      title: template.title,
      description: template.description,
      eventId: template.eventId,
      signatureName: template.signatureName,
      signatureRole: template.signatureRole,
    });
    setEditingId(template.id);
    setRegistrationId(
      registrations.find((item) => item.eventId === template.eventId)?.id || ""
    );
    setErrors([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const doPublish = () => {
    if (!validate()) return;
    setPublishConfirm(true);
  };
  const publish = () => {
    const templateId = editingId || crypto.randomUUID();
    const existing = templates.find((item) => item.id === editingId);
    const now = new Date().toISOString();
    const template: CertificateTemplate = {
      id: templateId,
      ...draft,
      status: "published",
      createdAt: existing?.createdAt || now,
      recipientCount: eligible.length,
    };
    const generated: Certificate[] = eligible.map((registration) => ({
      id: crypto.randomUUID(),
      templateId,
      registrationId: registration.id,
      eventId: registration.eventId,
      recipientName: certificateRecipient(
        registration,
        registration.members[0] || sampleUser.name
      ),
      publishedAt: now,
    }));
    setCertificates((current) => [
      ...current.filter((item) => item.templateId !== templateId),
      ...generated,
    ]);
    setTemplates((current) =>
      existing
        ? current.map((item) => (item.id === templateId ? template : item))
        : [template, ...current]
    );
    setEditingId(templateId);
    setPublishConfirm(false);
    setErrors([]);
    toast(`Certificates published for ${generated.length} registrations`);
  };
  const update = <K extends keyof CertificateDraft>(
    key: K,
    value: CertificateDraft[K]
  ) => setDraft((current) => ({ ...current, [key]: value }));
  return (
    <>
      <div className="certificates-title">
        <div>
          <div className="eyebrow">CELEBRATE EVERY CONTRIBUTION</div>
          <h1>Certificates</h1>
          <p>Create, preview, and publish participation certificates.</p>
        </div>
        <button className="btn btn-dark" onClick={newDraft}>
          <Plus size={16} /> New certificate
        </button>
      </div>
      <div className="certificate-layout">
        <section className="certificate-builder bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="certificate-builder-heading">
            <div>
              <span className="section-kicker">CERTIFICATE BUILDER</span>
              <h2>{editingId ? "Edit certificate" : "New certificate"}</h2>
            </div>
            <span
              className={`certificate-state ${
                templates.find((item) => item.id === editingId)?.status ||
                "draft"
              }`}
            >
              {templates.find((item) => item.id === editingId)?.status ||
                "draft"}
            </span>
          </div>
          <label className="field-label">
            CERTIFICATE TITLE
            <input
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="Certificate of Participation"
            />
          </label>
          <label className="field-label">
            DESCRIPTION
            <textarea
              rows={3}
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="For participating in the fest…"
            />
          </label>
          <label className="field-label">
            EVENT
            <select
              value={draft.eventId}
              onChange={(event) => {
                update("eventId", event.target.value);
                setRegistrationId(
                  registrations.find(
                    (item) => item.eventId === event.target.value
                  )?.id || ""
                );
              }}
            >
              {events.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <div className="certificate-form-row">
            <label className="field-label">
              SIGNATURE NAME
              <input
                value={draft.signatureName}
                onChange={(event) =>
                  update("signatureName", event.target.value)
                }
                placeholder="Coordinator name"
              />
            </label>
            <label className="field-label">
              SIGNATURE ROLE
              <input
                value={draft.signatureRole}
                onChange={(event) =>
                  update("signatureRole", event.target.value)
                }
                placeholder="Fest Coordinator"
              />
            </label>
          </div>
          <label className="field-label">
            PREVIEW RECIPIENT
            <select
              value={selectedRegistration?.id || ""}
              onChange={(event) => setRegistrationId(event.target.value)}
              disabled={!eligible.length}
            >
              {eligible.map((registration) => (
                <option key={registration.id} value={registration.id}>
                  {certificateRecipient(
                    registration,
                    registration.members[0] || sampleUser.name
                  )}{" "}
                  · {registration.teamName ? "Team" : "Solo"}
                </option>
              ))}
            </select>
          </label>
          {errors.length > 0 && (
            <ul className="certificate-errors" role="alert">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
          <div className="certificate-actions">
            <button
              className="btn btn-outline"
              onClick={() => {
                setPreviewPublished(false);
                setPreview(true);
              }}
            >
              <Eye size={15} /> Preview
            </button>
            <button className="btn btn-outline" onClick={saveDraft}>
              Save draft
            </button>
            <button className="btn btn-dark" onClick={doPublish}>
              Publish certificates <ArrowRight size={15} />
            </button>
          </div>
        </section>
        <aside className="certificate-preview-pane">
          <div className="certificate-preview-label">
            <span className="section-kicker">LIVE PREVIEW</span>
            <span>{event?.title}</span>
          </div>
          <ParticipationCertificate
            recipientName={
              selectedRegistration
                ? certificateRecipient(
                    selectedRegistration,
                    selectedRegistration.members[0] || sampleUser.name
                  )
                : "No eligible participant"
            }
            eventName={event?.title || "Event name"}
            title={draft.title}
            description={draft.description}
            signatureName={draft.signatureName}
            signatureRole={draft.signatureRole}
          />
        </aside>
      </div>
      <section className="certificate-list">
        <div className="certificate-list-heading">
          <div>
            <span className="section-kicker">MANAGE CERTIFICATES</span>
            <h2>Certificate templates</h2>
          </div>
          <span>{certificates.length} published certificates</span>
        </div>
        {loading ? (
          <div className="volunteer-loading">
            <i />
            <i />
            <i />
          </div>
        ) : templates.length === 0 ? (
          <EmptyState
            title="No certificates yet"
            message="Create a certificate template for one of your events."
          />
        ) : (
          <div className="certificate-table">
            <div className="certificate-row certificate-head">
              <span>CERTIFICATE</span>
              <span>EVENT</span>
              <span>RECIPIENTS</span>
              <span>STATUS</span>
              <span>CREATED</span>
              <span>ACTIONS</span>
            </div>
            {templates.map((template) => (
              <div className="certificate-row" key={template.id}>
                <b>{template.title}</b>
                <span>
                  {events.find((item) => item.id === template.eventId)?.title ||
                    "—"}
                </span>
                <span>
                  {template.status === "published"
                    ? template.recipientCount
                    : "—"}
                </span>
                <span>
                  <i className={`certificate-state ${template.status}`}>
                    {template.status}
                  </i>
                </span>
                <span>
                  {new Date(template.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="certificate-row-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      edit(template);
                      setPreviewPublished(template.status === "published");
                      setPreview(true);
                    }}
                  >
                    {template.status === "published" ? "View" : "Preview"}
                  </button>
                  {template.status === "draft" && (
                    <button
                      className="btn btn-outline"
                      onClick={() => edit(template)}
                    >
                      Edit
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
      {preview && (
        <AdminDialog
          title={
            previewPublished ? "Published certificate" : "Certificate preview"
          }
          close={() => setPreview(false)}
        >
          <ParticipationCertificate
            recipientName={
              selectedRegistration
                ? certificateRecipient(
                    selectedRegistration,
                    selectedRegistration.members[0] || sampleUser.name
                  )
                : "No eligible participant"
            }
            eventName={event?.title || "Event name"}
            title={draft.title}
            description={draft.description}
            signatureName={draft.signatureName}
            signatureRole={draft.signatureRole}
          />
          <div className="modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setPreview(false)}
            >
              Close preview
            </button>
            {!previewPublished && (
              <button
                className="btn btn-dark"
                onClick={() => {
                  setPreview(false);
                  doPublish();
                }}
              >
                Publish certificate <ArrowRight size={15} />
              </button>
            )}
          </div>
        </AdminDialog>
      )}
      {publishConfirm && (
        <AdminDialog
          title="Publish certificates?"
          close={() => setPublishConfirm(false)}
        >
          <p className="publish-copy">
            This will publish certificates for{" "}
            <b>{eligible.length} registrations</b> from <b>{event?.title}</b>.
            Team registrations receive one certificate using the team name; solo
            registrations use the participant name.
          </p>
          <div className="modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setPublishConfirm(false)}
            >
              Cancel
            </button>
            <button className="btn btn-dark" onClick={publish}>
              Publish certificates
            </button>
          </div>
        </AdminDialog>
      )}
    </>
  );
}
