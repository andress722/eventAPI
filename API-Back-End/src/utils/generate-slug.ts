export function generateSlug(text: string): string {
    return text
        .toLowerCase() // Converte para minúsculas
        .normalize("NFD") // Normaliza para decompor caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // Remove marcas de acentuação
        .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos
        .trim() // Remove espaços no início e no fim
        .replace(/\s+/g, "-"); // Substitui espaços por hífens
}